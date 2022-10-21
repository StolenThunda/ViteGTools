import { defineStore } from "pinia";
// import "src/middleware/monkeypatch.js"
export const useTunerStore = defineStore("tuner", {
  state: () => ({
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
    message: "",
    workletNode: null,
    analyser: null,
    NoteDetected: {},
    oscillator: null,
  }),

  getters: {
    getFreqBinCount: (state) => state.analyser.frequencyBinCount,
    isAnalyserInitialized: (state) => !!state.analyser,
  },

  actions: {
    // initGetUserMedia () {
    //   this.audioContext = window.AudioContext || window.webkitAudioContext;
    //   if ( !this.audioContext ) {
    //     return alert( "AudioContext not supported" );
    //   }

    //   // Older browsers might not implement mediaDevices at all, so we set an empty object first
    //   if ( navigator.mediaDevices === undefined ) {
    //     navigator.mediaDevices = {};
    //   }

    //   // Some browsers partially implement mediaDevices. We can't just assign an object
    //   // with getUserMedia as it would overwrite existing properties.
    //   // Here, we will just add the getUserMedia property if it's missing.
    //   if ( navigator.mediaDevices.getUserMedia === undefined ) {
    //     navigator.mediaDevices.getUserMedia = function ( constraints ) {
    //       // First get ahold of the legacy getUserMedia, if present
    //       const getUserMedia =
    //         navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

    //       // Some browsers just don't implement it - return a rejected promise with an error
    //       // to keep a consistent interface
    //       if ( !getUserMedia ) {
    //         alert( "getUserMedia is not implemented in this browser" );
    //       }

    //       // Otherwise, wrap the call to the old navigator.getUserMedia with a Promise
    //       return new Promise( function ( resolve, reject ) {
    //         getUserMedia?.call( navigator, constraints, resolve, reject );
    //       } );
    //     };
    //   }
    // },
    async startRecord() {
      await this.init();
      // if ( this.isIOS || audioinputInstalled ) {
      // if ( audioinputInstalled ) {

      //   // ConsoleMessage("Microphone input starting...");
      //   // window.audioinput.start();
      //   // this.audioContext = window.audioinput.getAudioContext();
      //   let stream = window.audioinput.getStream();
      //   // ConsoleMessage(`stream: ${stream}`);
      //   await this.setup( stream )
      //     .then( () => {
      //       this.message = "Microphone input started!";
      //     } )
      //     .catch( ( err ) => {
      //       this.message = `IsIOS / AI Installed Error: ${err}`;
      //     } );
      // } else {
      console.log("start record");
      await navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          this.message = "Microphone: " + stream;
          this.setup(stream);
        })
        .catch((error) => {
          this.message = `mediadevices error: ${error.name} = ${error.message}`;
        });
      // }
    },
    async setup(stream) {
      this.message = `setup ${JSON.stringify(stream)}`;
      let source = this.audioContext.createMediaStreamSource(stream);
      source
        .connect(this.analyser)
        .connect(this.workletNode)
        .connect(this.audioContext.destination);
    },
    getAutoCorrolatedPitch(audioData, corrolatedSignal) {
      // First: autocorrolate the signal

      let maximaCount = 0;
      let localMaxima = [];

      for (let l = 0; l < this.analyser.fftSize; l++) {
        corrolatedSignal[l] = 0;
        for (let i = 0; i < this.analyser.fftSize - l; i++) {
          corrolatedSignal[l] += audioData[i] * audioData[i + l];
        }
        if (l > 1) {
          if (
            corrolatedSignal[l - 2] - corrolatedSignal[l - 1] < 0 &&
            corrolatedSignal[l - 1] - corrolatedSignal[l] > 0
          ) {
            localMaxima[maximaCount] = l - 1;
            maximaCount++;
            if (maximaCount >= localMaxima.length) break;
          }
        }
      }

      // Second: find the average distance in samples between maxima

      let maximaMean = localMaxima[0];

      for (let i = 1; i < maximaCount; i++)
        maximaMean += localMaxima[i] - localMaxima[i - 1];

      maximaMean /= maximaCount;

      return parseFloat(this.audioContext.sampleRate / maximaMean).toFixed(1);
    },
    getWorkletNode(ctx) {
      if (ctx.audioWorklet) {
        return ctx.audioWorklet
          .addModule("worklets/tuner.worklet.js")
          .then(async () => {
            this.message = "worklet loaded";
            let tunerNode = await new AudioWorkletNode(
              this.audioContext,
              "tuner-proc"
            );
            tunerNode.port.onmessage = (e) => {
              if (e.data instanceof Float32Array) {
                const audioData = e.data;
                let corrolatedSignal = new Float32Array( this.analyser.fftSize );
                this.analyser.getFloatTimeDomainData( audioData );

                // const audioData = new Uint8Array(this.analyser.frequencyBinCount)
                // let corrolatedSignal = new Uint8Array(
                //   this.analyser.frequencyBinCount
                // );
                // this.analyser.getByteFrequencyData(audioData);

                const frequency = this.getAutoCorrolatedPitch(
                  audioData,
                  corrolatedSignal
                );
                if (frequency > 3270) return;
                this.message = `worklet data: ${frequency}`;
                console.log(this.message);
                if (frequency) {
                  const note = this.getNote(frequency);
                  this.NoteDetected = {
                    name: this.noteStrings[note % 12],
                    value: note,
                    cents: this.getCents(frequency, note),
                    octave: parseInt(note / 12) - 1,
                    frequency: frequency,
                  };
                }
              }
            };
            return tunerNode;
          })
          .catch((err) => {
            console.log(`worklet error: ${err}`);
          });
      }
    },
    getAudioContext() {
      return new (window.AudioContext || window.webkitAudioContext)();
    },
    stopRecord() {
      this.audioContext = null;
      this.analyser = null;
      this.workletNode = null;
    },
    async init() {
      try {
        this.audioContext = this.getAudioContext();
        this.analyser = this.audioContext.createAnalyser();
        // this.analyser.minDecibels = -90;
        // this.analyser.maxDecibels = 0;
        // this.analyser.fftSize = 4096;
        this.workletNode = await this.getWorkletNode( this.audioContext );
        console.log('Tuner Initialized')
      } catch (error) {
        console.error({ error });
      }

      // console.dir( this );
    },
    getNote(frequency) {
      const note = 12 * (Math.log(frequency / this.middleA) / Math.log(2));
      return Math.round(note) + this.semitone;
    },
    getStandardFrequency(note) {
      return this.middleA * Math.pow(2, (note - this.semitone) / 12);
    },
    getCents(frequency, note) {
      return Math.floor(
        (1200 * Math.log(frequency / this.getStandardFrequency(note))) /
          Math.log(2)
      );
    },
    play(frequency) {
      this.audioContext = this.getAudioContext();
      // ConsoleMessage(`audioContext: ${this.audioContext}`);
      if (!this.oscillator) {
        this.oscillator = this.audioContext.createOscillator();
        this.oscillator.connect(this.audioContext.destination);
        this.oscillator.start();
      }
      this.oscillator.frequency.value = frequency;
    },
    stop() {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator = null;
      }
    },
    checkIOSPerms() {
      try {
        if (window.audioinput && !window.audioinput.isCapturing()) {
          getMicrophonePermission(this.setup(window.audioinput.getStream()));
        } else {
          this.message = "Already capturing!";
        }
      } catch (ex) {
        this.message = "startCapture exception: " + ex;
      }
    },
  },
});
