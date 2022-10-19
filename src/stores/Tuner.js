import { defineStore } from 'pinia'

export const useTunerStore = defineStore( 'tuner', {
  state: () => ( {
    info: null,
    middleA: 440,
    semitone: 69,
    bufferSize: 4096,
    noteStrings: [
      "C",
      "C♯",
      "D",
      "D♯",
      "E",
      "F",
      "F♯",
      "G",
      "G♯",
      "A",
      "A♯",
      "B",
    ],
    audioContext: null,
    audioinputInstalled: false,
    message: '',
    workletNode: null,
    analyser: null,
    pitchDetector: null,
    onNoteDetected: false,
    oscillator: null
  } ),

  getters: {

  },

  actions: {
    initGetUserMedia () {
      this.audioContext = window.AudioContext || window.webkitAudioContext;
      if ( !this.audioContext ) {
        return alert( "AudioContext not supported" );
      }

      // Older browsers might not implement mediaDevices at all, so we set an empty object first
      if ( navigator.mediaDevices === undefined ) {
        navigator.mediaDevices = {};
      }

      // Some browsers partially implement mediaDevices. We can't just assign an object
      // with getUserMedia as it would overwrite existing properties.
      // Here, we will just add the getUserMedia property if it's missing.
      if ( navigator.mediaDevices.getUserMedia === undefined ) {
        navigator.mediaDevices.getUserMedia = function ( constraints ) {
          // First get ahold of the legacy getUserMedia, if present
          const getUserMedia =
            navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

          // Some browsers just don't implement it - return a rejected promise with an error
          // to keep a consistent interface
          if ( !getUserMedia ) {
            alert( "getUserMedia is not implemented in this browser" );
          }

          // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
          return new Promise( function ( resolve, reject ) {
            getUserMedia?.call( navigator, constraints, resolve, reject );
          } );
        };
      }
    },
    async startRecord () {
      // if ( self.isIOS || audioinputInstalled ) {
      if ( audioinputInstalled ) {

        // ConsoleMessage("Microphone input starting...");
        window.audioinput.start();
        this.audioContext = window.audioinput.getAudioContext();
        let stream = window.audioinput.getStream();
        // ConsoleMessage(`stream: ${stream}`);
        await self.setup( stream )
          .then( () => {
            this.message = "Microphone input started!";
          } )
          .catch( ( err ) => {
            this.message = `IsIOS / AI Installed Error: ${err}`;
          } );
      } else {
        await navigator.mediaDevices
          .getUserMedia( { audio: true } )
          .then( ( stream ) => {
            this.message = "Microphone: " + stream;
            self.setup( stream );
          } )
          .catch( ( error ) => {
            this.message = `mediadevices error: ${error.name} = ${error.message}`;
          } );
      }
    },
    setup ( stream ) {
      this.message = `setup ${stream}`
      let source = this.audioContext.createMediaStreamSource( stream );
      source
        .connect( this.analyser )
        .connect( this.workletNode )
        .connect( this.audioContext.destination );
    },
    getWorkletNode ( ctx ) {
      if ( ctx.audioWorklet ) {
        console.log( `ctx.audioWorklet: ${ctx.audioWorklet}` );
        return ctx.audioWorklet
          .addModule( "worklets/tuner.worklet.js" )
          .then( async () => {
            this.message = "worklet loaded"
            let tunerNode = await new AudioWorkletNode(
              this.audioContext,
              "tuner-proc"
            );
            tunerNode.port.onmessage = ( e ) => {
              if ( e.data instanceof Float32Array ) {
                const audioData = e.data;
                // process pcm data
                const frequency = this.pitchDetector.do( audioData );
                this.message = "worklet data: ", audioData;
                if ( frequency && this.onNoteDetected ) {
                  const note = this.getNote( frequency );
                  this.onNoteDetected( {
                    name: this.noteStrings[note % 12],
                    value: note,
                    cents: this.getCents( frequency, note ),
                    octave: parseInt( note / 12 ) - 1,
                    frequency: frequency,
                  } );
                }
              }
            };
            return tunerNode;
          } )
          .catch( ( err ) => {
            console.log( `worklet error: ${err}` );
          } );
      }
    },
    getAudioContext () {
      let ctx;
      if ( this.audioContext ) ctx = this.audioContext;
      if ( window.audioinput ) ctx = window.audioinput.getAudioContext();
      // if ( navigator.mediaDevices instanceOf Object)
      ctx = new ( window.AudioContext || window.webkitAudioContext )();
      return ctx;
    },
    async init () {
      this.audioContext = this.getAudioContext();
      this.analyser = this.audioContext.createAnalyser();
      this.workletNode = await this.getWorkletNode( this.audioContext );

      aubio().then( function ( aubio ) {
        this.pitchDetector = new aubio.Pitch(
          "default",
          this.bufferSize,
          1,
          this.audioContext.sampleRate
        );
        this.startRecord();
      } );
      console.dir( this );
    },
    getNote () {
      const note = 12 * ( Math.log( frequency / this.middleA ) / Math.log( 2 ) );
      return Math.round( note ) + this.semitone;
    },
    getStandardFrequency ( note ) {
      return this.middleA * Math.pow( 2, ( note - this.semitone ) / 12 );
    },
    getCents ( frequency, note ) {
      return Math.floor(
        ( 1200 * Math.log( frequency / this.getStandardFrequency( note ) ) ) / Math.log( 2 )
      );
    },
    play ( frequency ) {
      this.audioContext = this.getAudioContext();
      // ConsoleMessage(`audioContext: ${this.audioContext}`);
      if ( !this.oscillator ) {
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.connect( this.audioContext.destination );
        this.oscillator.start();
      }
      this.oscillator.frequency.value = frequency;
    },
    stop () {
      if ( this.oscillator ) {
        this.oscillator.stop();
        this.oscillator = null;
      }
    },
    checkIOSPerms () {
      try {
        if ( window.audioinput && !window.audioinput.isCapturing() ) {
          getMicrophonePermission(
            this.setup( window.audioinput.getStream() )
          );
        } else {
          this.message = "Already capturing!";
        }
      } catch ( ex ) {
        this.message = "startCapture exception: " + ex;
      }
    }
  }
} )
