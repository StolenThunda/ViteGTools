( function () {
   let OnlineTuner = function () {
    this.VERSION = "1.0";
    // this.installArray();
    // this.installFloat32Array()
  };
  OnlineTuner.prototype = {
    $: function ( a ) {
      return document.getElementById( a )
    },
    virtual: function () {
      throw "call pure virtual function";
    },
    installFloat32Array: function () {
      Float32Array.prototype.max = function () {
        return Math.max.apply( null, this )
      };
      Float32Array.prototype.indexof = function ( a ) {
        return Array.prototype.indexOf.call( this, a )
      };
      Float32Array.prototype.slice = function ( a, b ) {
        return Array.prototype.slice.call( this, a, b )
      };
      Float32Array.prototype.select = function ( f ) {
        for ( var i = 0; i < this.length; i++ ) {
          this[i] = f( this[i] )
        }
      }
    },
    installArray: function () {
      Array.prototype.map = function ( f ) {
        var a = new Array( this.length );
        for ( var i in this ) {
          a[i] = f( this[i] )
        };
        return a
      };
      Array.prototype.where = function ( f ) {
        var a = new Array();
        for ( var i in this ) {
          if ( f( this[i] ) ) {
            a[i] = this[i]
          }
        };
        return a
      }
    },
    getUserMediaFunction: function () {
      return navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
    },
    isHtml5Compatible: function () {
      return !!this.getUserMediaFunction()
    },
    getUserMedia: function ( a, b, c ) {
      return this.getUserMediaFunction().call( navigator, a, b, c )
    },
    createAudioContext: function () {
      var a = window.AudioContext || window.webkitAudioContext;
      return new a()
    }
  }
} )();
this.OnlineTuner = new OnlineTuner();
( function () {
  var g = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"];
  var h = function ( a ) {
    var b = new Float32Array( a );
    for ( var i = 0; i < b.length; i++ ) {
      b[i] = 0.42 - 0.5 * Math.cos( 2 * Math.PI * i / ( b.length - 1 ) ) + 0.08 * Math.cos( 4 * Math.PI * i / ( b.length - 1 ) )
    }
    return b
  };
  var j = function ( a ) {
    var b = new Float32Array( a );
    for ( var i = 0; i < b.length; i++ ) {
      b[i] = 0.54 - 0.46 * Math.cos( 2 * Math.PI * i / b.length )
    }
    return b
  };
  var k = function ( a ) {
    return 12 * Math.log( a / 440.0 ) / Math.LN2
  };
  var l = function ( a ) {
    return ( ( a - 2 ) / Math.abs( a - 2 ) ) * Math.floor( Math.abs( a - 2 ) / 12 ) + 4
  };
  var m = function ( a ) {
    var b = Math.round( a ) % g.length;
    if ( b < 0 ) return g[12 + b];
    else return g[b]
  };
  var n = function ( c, d, e ) {
    this.highFrequency = e || 350.0;
    this.precision = d || ( 4 * 16384 );
    this.controllers = c;
    this.audioContext = OnlineTuner.createAudioContext();
    this.inputStream = new Float32Array( this.precision );
    this.fft = new OnlineTuner.FFT( this.precision, this.audioContext.sampleRate );
    this.scriptNode = this.audioContext.createScriptProcessor( Math.min( this.precision, 16384 ), 1, 1 );
    var f = this;
    this.scriptNode.onaudioprocess = function ( a ) {
      var b = a.inputBuffer.getChannelData( 0 );
      f.update( b )
    };
    this.scriptNode.connect( this.audioContext.destination );
    this.input = null;
    this.window = h( this.precision )
  };
  n.prototype = {
    install: function ( b, c ) {
      if ( !OnlineTuner.isHtml5Compatible() ) {
        c( "Not html5 browser compliant" );
        return
      }
      var d = this;
      OnlineTuner.getUserMedia( {
        audio: true
      }, function ( a ) {
        d.input = d.audioContext.createMediaStreamSource( a );
        d.input.connect( d.scriptNode );
        b()
      }, function ( e ) {
        c( e )
      } )
    },
    update: function ( a ) {
      this.inputStream.set( this.inputStream.subarray( this.precision ) );
      this.inputStream.set( a, this.inputStream.length - a.length );
      for ( var i = 0; i < a.length; i++ ) {
        this.inputStream[i] *= this.window[i]
      }
      this.fft.forward( this.inputStream );
      for ( var i = 0; i < this.fft.spectrum.length; i++ ) {
        this.fft.spectrum[i] *= this.microResponse( i )
      }
      for ( var i = 0; i < this.controllers.length; i++ ) {
        this.controllers[i].notify( this.getInfo() )
      }
    },
    getError: function () {
      return this.audioContext.sampleRate / this.precision
    },
    getData: function () {
      return this.fft.spectrum
    },
    getStepError: function ( a ) {
      return k( a + this.getError() ) - k( a )
    },
    getInfo: function () {
      var a = this.getData().subarray( 0, this.highFrequency / this.getError() );
      var b = ( a.indexof( a.max() ) * this.getError() );
      if ( b == 0 ) b = 440.0;
      var c = k( b );
      return {
        frequency: b,
        step: c,
        error: this.getError( b ),
        stepError: this.getStepError( b ),
        note: m( c ),
        octave: l( c )
      }
    },
    microResponse: function ( i ) {
      if ( i * this.getError() < this.microphoneResponseFrequency ) {
        return -1 * 0.06 * this.getError() * i + 13
      } else {
        return 1.0
      }
    }
  };
  OnlineTuner.Analyser = n
} )();
( function () {
  var f = [-5, -10, -14, -19, -24, -29];
  var g = ["E", "B", "G", "D", "A", "E"];
  var h = function ( a ) {
    var b = f.map( function ( e ) {
      return Math.abs( e - a.step )
    } );
    var c = b.indexOf( Math.min.apply( null, b ) );
    var d = f[c] - a.step;
    if ( Math.abs( d ) - a.stepError < 0 ) {
      d = 0
    }
    return {
      string: c + 1,
      note: g[c],
      delta: d
    }
  };
  var i = function () { };
  i.prototype = {
    notify: OnlineTuner.virtual
  };
  var j = function ( a ) {
    i.call( this );
    this.widget = a
  };
  j.prototype = {
    notify: function ( a ) {
      var b = h( a );
      this.widget.show( -( b.delta ) / 5.0, b.note, "string " + b.string, a.note + "" + a.octave + "(" + Math.round( a.frequency ) + "Hz)" )
    }
  };
  OnlineTuner.Controller = {
    GuitareTuner: j
  }
} )();
( function () {
  function FourierTransform ( b, c ) {
    this.bufferSize = b;
    this.sampleRate = c;
    this.bandwidth = 2 / b * c / 2;
    this.spectrum = new Float32Array( b / 2 );
    this.real = new Float32Array( b );
    this.imag = new Float32Array( b );
    this.peakBand = 0;
    this.peak = 0;
    this.getBandFrequency = function ( a ) {
      return this.bandwidth * a + this.bandwidth / 2
    };
    this.calculateSpectrum = function () {
      var a = this.spectrum,
        real = this.real,
        imag = this.imag,
        bSi = 2 / this.bufferSize,
        sqrt = Math.sqrt,
        rval, ival, mag;
      for ( var i = 0, N = b / 2; i < N; i++ ) {
        rval = real[i];
        ival = imag[i];
        mag = bSi * sqrt( rval * rval + ival * ival );
        if ( mag > this.peak ) {
          this.peakBand = i;
          this.peak = mag
        }
        a[i] = mag
      }
    }
  }

  function FFT ( a, b ) {
    FourierTransform.call( this, a, b );
    this.reverseTable = new Uint32Array( a );
    var c = 1;
    var d = a >> 1;
    var i;
    while ( c < a ) {
      for ( i = 0; i < c; i++ ) {
        this.reverseTable[i + c] = this.reverseTable[i] + d
      }
      c = c << 1;
      d = d >> 1
    }
    this.sinTable = new Float32Array( a );
    this.cosTable = new Float32Array( a );
    for ( i = 0; i < a; i++ ) {
      this.sinTable[i] = Math.sin( -Math.PI / i );
      this.cosTable[i] = Math.cos( -Math.PI / i )
    }
  }
  FFT.prototype = {
    forward: function ( a ) {
      var b = this.bufferSize,
        cosTable = this.cosTable,
        sinTable = this.sinTable,
        reverseTable = this.reverseTable,
        real = this.real,
        imag = this.imag,
        spectrum = this.spectrum;
      var k = Math.floor( Math.log( b ) / Math.LN2 );
      if ( Math.pow( 2, k ) !== b ) {
        throw "Invalid buffer size, must be a power of 2.";
      }
      if ( b !== a.length ) {
        throw "Supplied buffer is not the same size as defined FFT. FFT Size: " + b + " Buffer Size: " + a.length;
      }
      var c = 1,
        phaseShiftStepReal, phaseShiftStepImag, currentPhaseShiftReal, currentPhaseShiftImag, off, tr, ti, tmpReal, i;
      for ( i = 0; i < b; i++ ) {
        real[i] = a[reverseTable[i]];
        imag[i] = 0
      }
      while ( c < b ) {
        phaseShiftStepReal = cosTable[c];
        phaseShiftStepImag = sinTable[c];
        currentPhaseShiftReal = 1;
        currentPhaseShiftImag = 0;
        for ( var d = 0; d < c; d++ ) {
          i = d;
          while ( i < b ) {
            off = i + c;
            tr = ( currentPhaseShiftReal * real[off] ) - ( currentPhaseShiftImag * imag[off] );
            ti = ( currentPhaseShiftReal * imag[off] ) + ( currentPhaseShiftImag * real[off] );
            real[off] = real[i] - tr;
            imag[off] = imag[i] - ti;
            real[i] += tr;
            imag[i] += ti;
            i += c << 1
          }
          tmpReal = currentPhaseShiftReal;
          currentPhaseShiftReal = ( tmpReal * phaseShiftStepReal ) - ( currentPhaseShiftImag * phaseShiftStepImag );
          currentPhaseShiftImag = ( tmpReal * phaseShiftStepImag ) + ( currentPhaseShiftImag * phaseShiftStepReal )
        }
        c = c << 1
      }
      return this.calculateSpectrum()
    },
    inverse: function ( a, b ) {
      var c = this.bufferSize,
        cosTable = this.cosTable,
        sinTable = this.sinTable,
        reverseTable = this.reverseTable,
        spectrum = this.spectrum;
      a = a || this.real;
      b = b || this.imag;
      var d = 1,
        phaseShiftStepReal, phaseShiftStepImag, currentPhaseShiftReal, currentPhaseShiftImag, off, tr, ti, tmpReal, i;
      for ( i = 0; i < c; i++ ) {
        b[i] *= -1
      }
      var e = new Float32Array( c );
      var f = new Float32Array( c );
      for ( i = 0; i < a.length; i++ ) {
        e[i] = a[reverseTable[i]];
        f[i] = b[reverseTable[i]]
      }
      a = e;
      b = f;
      while ( d < c ) {
        phaseShiftStepReal = cosTable[d];
        phaseShiftStepImag = sinTable[d];
        currentPhaseShiftReal = 1;
        currentPhaseShiftImag = 0;
        for ( var g = 0; g < d; g++ ) {
          i = g;
          while ( i < c ) {
            off = i + d;
            tr = ( currentPhaseShiftReal * a[off] ) - ( currentPhaseShiftImag * b[off] );
            ti = ( currentPhaseShiftReal * b[off] ) + ( currentPhaseShiftImag * a[off] );
            a[off] = a[i] - tr;
            b[off] = b[i] - ti;
            a[i] += tr;
            b[i] += ti;
            i += d << 1
          }
          tmpReal = currentPhaseShiftReal;
          currentPhaseShiftReal = ( tmpReal * phaseShiftStepReal ) - ( currentPhaseShiftImag * phaseShiftStepImag );
          currentPhaseShiftImag = ( tmpReal * phaseShiftStepImag ) + ( currentPhaseShiftImag * phaseShiftStepReal )
        }
        d = d << 1
      }
      var h = new Float32Array( c );
      for ( i = 0; i < c; i++ ) {
        h[i] = a[i] / c
      }
      return h
    }
  };
  OnlineTuner.FFT = FFT
} )();
( function () {
  var f = function ( a, b, c, d, e ) {
    this.canvas = a;
    this.bgColor = b;
    this.deltaColor = c;
    this.okColor = d;
    this.fontColor = e;
    this.ctx = this.canvas.getContext( "2d" )
  };
  f.prototype = {
    show: function ( a, b, c, d ) {
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect( 0, 0, this.canvas.width, this.canvas.height );
      this.ctx.beginPath();
      this.ctx.moveTo( this.canvas.width / 2, this.canvas.height / 2 );
      this.ctx.arc( this.canvas.width / 2, this.canvas.height / 2, this.canvas.width / 2, -Math.PI / 2.0, -Math.PI / 2.0 + a * Math.PI, a <= 0 );
      this.ctx.lineTo( this.canvas.width / 2, this.canvas.height / 2 );
      this.ctx.fillStyle = this.deltaColor;
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.beginPath();
      this.ctx.arc( this.canvas.width / 2, this.canvas.height / 2, ( 4 * this.canvas.width ) / 10, 0, 2 * Math.PI );
      this.ctx.fillStyle = a == 0 ? this.okColor : this.bgColor;
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.font = '70pt Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = this.fontColor;
      this.ctx.fillText( b, this.canvas.width / 2, this.canvas.height / 2 + 15 );
      this.ctx.font = '20pt Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = this.fontColor;
      this.ctx.fillText( c, this.canvas.width / 2, this.canvas.height / 2 + 55 );
      this.ctx.font = '15pt Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = this.fontColor;
      this.ctx.fillText( d, this.canvas.width / 2, this.canvas.height / 2 + 85 )
    }
  };
  OnlineTuner.Widget = {
    CircleWidget: f
  }
} )();
