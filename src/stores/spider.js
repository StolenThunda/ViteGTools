import { defineStore } from 'pinia'
import { Howl, Howler } from "howler";
export const useSpiderStore = defineStore( 'spider', {
  state: () => ( {
    messageString: '',
    resting: false,
    tempo: 150,
    stringSpacing: 18.8,
    stringOffset: -3.5,
    dotStrings: [1, 1, 1, 1],
    dotDirections: [1, 1, 1, 1],
    dotState: 0,
    whichDot: null,
    allCombinations: [
      [1, 2, 3, 4],
      [1, 2, 4, 3],
      [1, 3, 2, 4],
      [1, 3, 4, 2],
      [1, 4, 2, 3],
      [1, 4, 3, 2],
      [2, 1, 3, 4],
      [2, 1, 4, 3],
      [2, 3, 1, 4],
      [2, 3, 4, 1],
      [2, 4, 1, 3],
      [2, 4, 3, 1],
      [3, 1, 2, 4],
      [3, 1, 4, 2],
      [3, 2, 1, 4],
      [3, 2, 4, 1],
      [3, 4, 1, 2],
      [3, 4, 2, 1],
      [4, 1, 2, 3],
      [4, 1, 3, 2],
      [4, 2, 1, 3],
      [4, 2, 3, 1],
      [4, 3, 1, 2],
      [4, 3, 2, 1],
    ],
    selectedCombinations: [],
    nRestCycle: 7,
    bRestFinished: false,
    bIsRunning: false,
    bIsPaused: false,
    bCountdownFinished: false,
    nCountdownCycle: 7,
    nCombinationIndex: 0,
    nCombinationDotIndex: -1,
    nStringIndex: 1,
    nTimerID: null,
    tockSound: new Howl( {
      src: ["/tock-sound.mp3"],
    } ),
    tickSound: new Howl( {
      src: ["/tick-sound.mp3"],
    } ),

    bAllChecks: false ,
    all_1: false,
    all_2: false,
    all_3: false,
    all_4: false,
  } ),

  getters: {
    getTempo ( state ) {
      let val = Math.max( 10, state.tempo );
      val = Math.min( 400, val );
      return val;
    },
    timerDelay ( state ) {
      return ( 60 / state.tempo ) * 1000;
    },
    comboCount ( state ) {
      return state.selectedCombinations.length;
    },

    currentCombo ( state ) {
      const comboName = state.selectedCombinations[state.nCombinationIndex];
      if ( !comboName) return;
      let idx = state.getComboIdxFromName( comboName.split( "-" )[1] )
      return state.allCombinations[idx];
    },
    getFormattedCombination ( state ) {
      return ( nIndex = 0 ) => {
        if ( nIndex > state.selectedCombinations.length - 1 ) return "";
        let nComboIndex = state.selectedCombinations[nIndex].split( "-" )[1];
        return state.allCombinations[nComboIndex].join( "-" );
      }
    },
    progress ( state ) {
      let nCurrentIndex = state.nCombinationIndex;
      let nTotalCount = state.selectedCombinations.length;
      if ( nTotalCount > 0 ) {
        let comboPercentage = parseFloat( ( nCurrentIndex / nTotalCount ) * 100 );
        let stringPercentage =
          ( state.nStringIndex - 1 ) * ( ( 100 / nTotalCount ) * 0.1 );

        let nPercent = comboPercentage + stringPercentage.toFixed(2) || 0;
        console.log( nPercent === 'NaN' )
        console.log({nPercent})
        if ( nPercent === 'NaN' ) nPercent = 0;
        return `${nPercent}%`;
      }
    },
  },
  actions: {
    updateCombinationMessage () {
      this.messageString = this.getFormattedCombination( this.nCombinationIndex )
    },
    getComboIdxFromName (cboName ) {
      return cboName.split( "-" )[1] || 0;
    },
    playClick ( tickOrTock ) {
      if (tickOrTock == 0) {
        this.tickSound.play();
      } else {
        this.tockSound.play();
      }
    },
    toggleRun () {
      if ( !this.bIsRunning ) {
        this.run();
      } else {
        this.pause();
      }
    },
    run () {
      //retrieve the list of combinations
      if (this.comboCount == 0) {
        return;
      }
      this.bIsRunning = true;
      this.bCountingDown = true;
      this.nCountdownCycle = 7;
      this.isCountingDown = true;
      this.nTimerID = setInterval(this.updateCallback, this.timerDelay);
    },
    pause() {
      this.bIsPaused = true;
      this.bIsRunning = false;
      clearInterval(this.nTimerID);
    },
    stop() {
      clearInterval(this.nTimerID);
      this.nTimerID = null;
      this.bIsPaused = false;
      this.bIsRunning = false;
      this.messageString = "";
    },
    updateCallback () {
      //Determine if we are counting down
      if (!this.bCountdownFinished) {
        // The countdown has not been finished,
        if (this.nCountdownCycle == 0) {
          this.messageString = `
            Get Ready... ${this.nCountdownCycle + 1} <br/>
            <small>Next: ${this.getFormattedCombination(
              this.nCombinationIndex + 1
            )}</small>`;
          this.playClick(
            this.nCountdownCycle == 7 || this.nCountdownCycle == 3 ? 0 : 1
          );
          // We've reached the end of the countdown.
          this.bCountdownFinished = true;
          this.nCountdownCycle = 7;
          if (this.nCombinationIndex == -1) {
            this.nCombinationIndex == 0;
          }
          return;
        } else {
          // We're still counting down, update the status
          this.messageString = `Get Ready... ${this.nCountdownCycle + 1}`;
          if (this.nCombinationIndex == 0) {
            this.messageString += `<br/><small>Start With: ${this.getFormattedCombination(
              this.nCombinationIndex
            )}</small>`;
          } else {
            this.messageString += `<br/><small>Next: ${this.getFormattedCombination(
              this.nCombinationIndex + 1
            )}</small>`;
          }
          this.playClick(
            this.nCountdownCycle == 7 || this.nCountdownCycle == 3 ? 0 : 1
          );
          this.nCountdownCycle--;
          return;
        }
      } else {
        // Countdown is over, now we're moving dots

        // Have we moved all the dots onto the current string?
        // (This matters because we don't really have to do much if we haven't)
        if (this.nCombinationDotIndex < 3) {
          this.nCombinationDotIndex++;

          // No, all the dots are not yet onto this string.
          if (this.nStringIndex == 1 && this.nCombinationDotIndex == 0) {

            this.updateCombinationMessage();
          }
        } else {
          // Yes, all the dots are on this string.

          // Are we on the last string?
          if (this.nStringIndex == 10) {
            // Yes, we are on the last string

            // Is this the last combination in the list?
            if (
              this.nCombinationIndex ==
              this.selectedCombinations.length - 1
            ) {
              // Yes, this is the final combination, and we have finished the final string . We are done.

              // this.updateProgress();
              this.progress = "100%";
              this.nStringIndex = 0;
              this.nCombinationIndex = 0;
              this.nCombinationDotIndex = 0;
              clearInterval(this.nTimerID);
              this.stop();
              this.messageString = "Done";
              return;
            } else if (
              this.nCombinationIndex <
              this.selectedCombinations.length - 1
            ) {
              // No, this is not the last combination, but we have reached the last string.
              // At this point we need to initiate a rest, and when that rest is over, advance to
              // the next combination.

              // Determine if we should be resting
              if (!this.bRestFinished) {
                // Our rest is not finished.

                if (this.nRestCycle == 0) {
                  // Our rest is finished.
                  this.messageString = `Rest... ${this.nRestCycle + 1}<br/>
                  <small>Next: ${this.getFormattedCombination(
                    this.nCombinationIndex + 1
                  )}</small>`;
                  this.playClick(1);
                  this.bRestFinished = true;
                  this.nRestCycle = 7;
                  return;
                } else {
                  if (this.nRestCycle == 7) {
                    this.dotState = 1;
                    this.resting = true;
                  }
                  this.playClick(
                    this.nRestCycle == 7 || this.nRestCycle == 3 ? 0 : 1
                  );
                  this.messageString = `Rest... ${this.nRestCycle + 1}<br/>
                  <small>Next: ${this.getFormattedCombination(
                    this.nCombinationIndex + 1
                  )}</small>`;

                  this.nRestCycle--;
                  return;
                }
              } else {
                // The rest has finished, let's reset it. We won't hit this again until it's time to rest again.
                this.bRestFinished = false;
                this.nRestCycle = 7;
                this.resting = false;

                // Now we advance the combination index.
                this.nCombinationIndex++;

                // Display information about the new combination.
                this.updateCombinationMessage();

                // Advance us to the next string
                this.nStringIndex = 1;

                // Start the dot count over
                this.nCombinationDotIndex = 0;

                this.updateCombinationMessage();
              }
            }
          } else if (this.nStringIndex < 10) {
            // We've hit the last dot, but we're not on the last string.
            this.nStringIndex++;
            // this.updateProgress();
            this.nCombinationDotIndex = 0;
          }
        }

        this.whichDot = this.currentCombo[this.nCombinationDotIndex] - 1;
        this.playClick(this.nCombinationDotIndex);
        // this.moveDot(whichDot);
      }
    },
  }
} )
