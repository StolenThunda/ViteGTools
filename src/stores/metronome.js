import { defineStore } from 'pinia'

export const useMetronomeStore = defineStore('metronome', {
  state: () => ({
    audioContext: null,
    isPlaying: false,
    startTime: null,
    currentTwelveNote: null,
    tempo: 120,
    meter: 4,
    masterVolume: 50,
    accentVolume: 100,
    quarterVolume: 75,
    eighthVolume: 0,
    sixteenthVolume: 0,
    tripletVolume: 0,
    lookahead: 25.0,
    scheduleAheadTime: 0.1,
    nextNoteTime: 0.0,
    noteLength: 0.05,
    notesInQueue: [],
    timerWorker: null,
    volumeNames: [
      'master',
      'accent',
      'quarter',
      'eighth',
      'sixteenth',
      'triplet'
    ]
  }),

  getters: {
    maxBeats (state) {
      return (state.meter  * 12)
    },
  },

  actions: {
    calcVolume ( beatVolume ) {
      return ( beatVolume * this.masterVolume );
    },

    scheduleNote ( beatNumber, time ) {
      // push the note on the queue, even if we're not playing.
      this.notesInQueue.push( { note: beatNumber, time: time } );

      // create oscillator & gainNode & connect them to the context destination
      var osc = this.audioContext.createOscillator();
      var gainNode = this.audioContext.createGain();

      osc.connect( gainNode );
      gainNode.connect( this.audioContext.destination );

      if ( beatNumber % this.maxBeats === 0 ) {
        if ( this.accentVolume > 0.25 ) {
          osc.frequency.value = 880.0;
          gainNode.gain.value = this.calcVolume( this.accentVolume );
        } else {
          osc.frequency.value = 440.0;
          gainNode.gain.value = this.calcVolume( this.quarterVolume );
        }
      } else if ( beatNumber % 12 === 0 ) {   // quarter notes = medium pitch
        osc.frequency.value = 440.0;
        gainNode.gain.value = this.calcVolume( this.quarterVolume );
      } else if ( beatNumber % 6 === 0 ) {
        osc.frequency.value = 440.0;
        gainNode.gain.value = this.calcVolume( this.eighthVolume );
      } else if ( beatNumber % 4 === 0 ) {
        osc.frequency.value = 300.0;
        gainNode.gain.value = this.calcVolume( this.tripletVolume );
      } else if ( beatNumber % 3 === 0 ) {                    // other 16th notes = low pitch
        osc.frequency.value = 220.0;
        gainNode.gain.value = this.calcVolume( this.sixteenthVolume );
      } else {
        gainNode.gain.value = 0;   // keep the remaining twelvelet notes inaudible
      }

      osc.start( time );
      osc.stop( time + this.noteLength );
    },
    scheduler () {
      while ( this.nextNoteTime < this.audioContext.currentTime + this.scheduleAheadTime ) {
        this.scheduleNote( this.currentTwelveletNote, this.nextNoteTime );
        this.nextTwelvelet();
      }
    },
    nextTwelvelet () {
      let secondsPerBeat = 60.0 / this.tempo
      this.nextNoteTime += 0.08333 * secondsPerBeat;    // Add beat length to last beat time
      this.currentTwelveletNote++;    // Advance the beat number, wrap to zero
      if ( this.currentTwelveletNote == this.maxBeats ) {
        this.currentTwelveletNote = 0;
      }
    },
    play () {
      this.isPlaying = !this.isPlaying;
      this.audioContext.resume()
      if ( this.isPlaying ) {
        this.currentTwelveletNote = 0;
        this.nextNoteTime = this.audioContext.currentTime;
        this.timerWorker.postMessage( "start" );
      } else {
        this.timerWorker.postMessage( "stop" );
      }
    },
    init () {
      this.timerWorker = new Worker( "worklets/metronome.worklet.js" );
      this.audioContext = new AudioContext()

      this.timerWorker.onmessage = function ( e ) {
        if ( e.data == "tick" ) {
          this.scheduler();
        } else {
          console.log( "message: " + e.data );
        }
      }.bind(this);

      this.timerWorker.postMessage( { "interval": this.lookahead } );
    }
  }
})
