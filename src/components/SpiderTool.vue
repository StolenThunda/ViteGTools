<template>

  <q-page class="resting">
    <div id="pageWrapper">
      <div
        id="topbar"
        class="control-bar"
      >
        <div
          class="control-bar-button dropdown"
          id="combinationsToggle"
          data-toggle="sidebar-dropdown"
        >
          <q-btn
            icon="fa fa-check-square"
            flat
            :label="`(${comboCount})`"
            :disabled="bIsRunning"
          >
            <q-menu
              class="dropdown-pane dark large"
              id="sidebar-dropdown"
              data-close-on-click="true"
              data-close-on-click-inside="false"
              data-dropdown
              v-model="showCombos"
            >
              <div id="combinations">
                <div id="combinationSelector">
                  <div class="row">
                    <div class="columns small-6 medium-3 q-px-md">
                      <div class="text-center">1st</div>
                      <div class="non-breaking">
                        <input
                          class="checkbox comboCategoryCheckbox"
                          type="checkbox"
                          id="all-1"
                          v-model="all_1"
                          @change="checkSet(1, this.checked, this);"
                        /><label for="all-1">All</label>
                      </div>
                      <q-option-group
                        v-model="selectedCombinations"
                        :options="chkOpts.slice(0, 6)"
                        :class="`checkbox comboCheckbox finger-1`"
                        type="checkbox"
                      />
                    </div>
                    <div class="columns small-6 medium-3 q-px-md">
                      <div class="text-center">2nd</div>
                      <div class="non-breaking">
                        <input
                          class="checkbox comboCategoryCheckbox"
                          type="checkbox"
                          id="all-2"
                          v-model="all_2"
                          @change="checkSet(2, this.checked);"
                        /><label for="all-2">All</label>
                      </div>
                      <q-option-group
                        v-model="selectedCombinations"
                        :options="chkOpts.slice(6, 12)"
                        :class="`checkbox comboCheckbox finger-2`"
                        type="checkbox"
                      />
                    </div>
                    <div class="columns small-6 medium-3 q-px-md">
                      <div class="text-center">3rd</div>
                      <div class="non-breaking">
                        <input
                          class="checkbox comboCategoryCheckbox"
                          type="checkbox"
                          id="all-3"
                          v-model="all_3"
                          @change="checkSet(3, this.checked);"
                        /><label for="all-3">All</label>
                      </div>
                      <q-option-group
                        v-model="selectedCombinations"
                        :options="chkOpts.slice(12, 18)"
                        :class="`checkbox comboCheckbox finger-3`"
                        type="checkbox"
                      />
                    </div>
                    <div class="columns small-6 medium-3 q-px-md">
                      <div class="text-center">4th</div>
                      <div class="non-breaking">
                        <input
                          class="checkbox comboCategoryCheckbox"
                          type="checkbox"
                          id="all-4"
                          v-model="all_4"
                          @change="checkSet(4, this.checked);"
                        /><label for="all-4">All</label>
                      </div>
                      <q-option-group
                        v-model="selectedCombinations"
                        :options="chkOpts.slice(18)"
                        :class="`checkbox comboCheckbox finger-4`"
                        type="checkbox"
                      />
                    </div>
                  </div>
                </div>
              </div>


            </q-menu>
          </q-btn>
        </div>
        <div class="control-bar-input-wrapper">
          <label>BPM:</label>
          <input
            id="tempo"
            type="number"
            v-model="tempo"
            size="4"
            :disabled="bIsRunning"
          />
        </div>
        <button
          class="control-bar-button"
          id="play"
          @click="toggleRun()"
          :disabled="comboCount === 0 && bIsRunning"
          :active="bIsRunning"
        >
        <i v-if="bIsRunning" class="fa fa-pause"></i>
        <i v-else class="fa fa-play"></i>
      </button>
        <button
          class="control-bar-button"
          id="stop"
          onClick="stop();"
          :disabled="!bIsRunning"
        ><i class="fa fa-stop"></i></button>
        <!-- <button class="control-bar-button" id="loop"><i class="fa fa-refresh"></i></button> -->
      </div>

      <div id="main">
        <div id="headerWrapper">
          <div id="message">MESSAGE</div>
        </div>
        <div class="fretboard">
          <div class="fretboard-mask">
            <div
              class="string"
              id="string1"
            ></div>
            <div
              class="string"
              id="string2"
            ></div>
            <div
              class="string"
              id="string3"
            ></div>
            <div
              class="string"
              id="string4"
            ></div>
            <div
              class="string"
              id="string5"
            ></div>
            <div
              class="string"
              id="string6"
            ></div>
            <div
              class="fret"
              id="fret1"
            ></div>
            <div
              class="fret"
              id="fret2"
            ></div>
            <div
              class="fret"
              id="fret3"
            ></div>
            <div
              class="fret"
              id="fret4"
            ></div>
            <div
              class="fret"
              id="fret5"
            ></div>
            <div
              class="fret"
              id="fret6"
            ></div>
            <div
              class="fret"
              id="fret7"
            ></div>
            <div
              class="dot"
              id="dot1"
            >1</div>
            <div
              class="dot"
              id="dot2"
            >2</div>
            <div
              class="dot"
              id="dot3"
            >3</div>
            <div
              class="dot"
              id="dot4"
            >4</div>
          </div>
        </div>
        <div id="progressBarWrapper">
          <div
            id="progressBar"
            class="progress-wrapper"
          >
            <div
              class="progress-indicator"
              id="progressIndicator"
            ></div>
          </div>
        </div>

      </div>
    </div>

  </q-page>
</template>
<script>
import { ref } from 'vue'
import { Howl, Howler } from 'howler';

const opts = [
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
  [4, 3, 2, 1]
]
export default {
  name: 'SpiderTool',
  data: () => ( {
    tempo: 150,
    stringSpacing: 18.8,
    stringOffset: -3.5,
    dotStrings: null,
    dotDirections: null,
    allCombinations: opts,
    selectedCombinations: ref( [] ),
    nRestCycle: null,
    bRestFinished: false,
    bIsRunning: false,
    bIsPaused: false,
    bCountdownFinished: false,
    nCountdownCycle: null,
    nCombinationIndex: null,
    nCombinationDotIndex: null,
    nStringIndex: null,
    nTimerID: null,
    tickSound: null,
    tockSound: null,
    showCombos: false,
    all_1: false,
    all_2: false,
    all_3: false,
    all_4: false,
  } ),
  watch: {
    tempo ( _new ) {
      let val = Math.max( 10, _new )
      val = Math.min( 400, val )
      return val
    }
  },
  computed: {
    timerDelay () {
      return ( 60 / this.tempo ) * 1000
    },
    comboCount () {
      return this.selectedCombinations.length
    },
    chkOpts () {
      const options = []
      opts.forEach( ( el, idx ) => {
        let objOption = {
          label: el.join( ' ' ),
          value: `combo-${idx}`,
          id: `combo-${idx}`
        }
        options.push( objOption )
      } )
      return options;
    },
    currentCombo () {
      let comboName = this.selectedCombinations[this.nCombinationIndex]
      return this.allCombinations[this.getComboIdxFromName( comboName )]
    }
  },
  mounted () {
    this.tickSound = new Howl( {
      src: ["/tock-sound.mp3"]
    } );
    this.tockSound = new Howl( {
      src: ['/tock-sound.mp3']
    } );
    this.reset();

  },
  methods: {
    // Utility
    getComboIdxFromName ( name ) {
      return name.split('-')[1]
    },
    // UI
    checkAll ( bIsChecked ) {
      this.elComboChecks.forEach( el => el.checked = bIsChecked )
    },
    checkSet ( nIndex = 1, bChecked = true, obj = null ) {
      // get value for set "all"
      bChecked = this['all_' + nIndex]

      // determine combo group
      let end = 6 * nIndex
      let start = end - 6

      for ( let i = start; i < end; i++ ) {
        // get id for checkboxes
        let combo = `combo-${i}`
        // toggle selection
        if ( bChecked ) {
          this.selectedCombinations.push( combo )
        } else {
          this.selectedCombinations = this.selectedCombinations.filter( el => el === combo )
        }
      }
    },
    updateProgress () {
      let nCurrentIndex = this.nCombinationIndex;
      let nTotalCount = this.selectedCombinations.length;
      if ( nTotalCount > 0 ) {
        let comboPercentage = parseFloat( ( nCurrentIndex / nTotalCount ) * 100 );
        let stringPercentage = ( this.nStringIndex - 1 ) * ( ( 100 / nTotalCount ) * .1 );

        let nPercent = comboPercentage + stringPercentage;
        document.querySelector( '#progressIndicator' ).style.width = `${nPercent}%`;

      }
    },
    getFormattedCombination ( nIndex = 0 ) {
      if ( nIndex > this.selectedCombinations.length - 1 ) return '';
      let nComboIndex = this.selectedCombinations[nIndex].split( '-' )[1]
      return opts[nComboIndex].join('-')
    },
    setMessage ( strMessage ) { document.querySelector( '#message' ).innerHTML = strMessage; },
    // Functional
    playClick ( tickOrTock ) {
      if ( tickOrTock == 0 ) { this.tickSound.play(); }
      else { this.tockSound.play(); }
    },
    toggleRun () {
      if ( !this.bIsRunning ) { this.run(); }
      else { this.pause(); }
    },
    run () {

      //retrieve the list of combinations
      if ( this.comboCount == 0 ) { return; }
      if ( this.initialize() ) {
        this.bIsRunning = true;
        this.bCountingDown = true;
        this.nCountdownCycle = 7;
        this.isCountingDown = true;
        this.updateProgress();
        this.nTimerID = setInterval( this.updateCallback, this.timerDelay );
      }
    },
    initialize () {
      //update the dots to match the first combination.
      this
        .setDotStates()
        .setDotsFirstPosition()

      //setup the countdown cycle
      this.nCountdownCycle = 7;
      this.nRestCycle = 7;
      return true;
    },
    pause () {
      this.bIsPaused = true;
      this.bIsRunning = false;
      clearInterval( this.nTimerID );
    },
    stop () {
      clearInterval( this.nTimerID );
      this.bIsPaused = false;
      this.bIsRunning = false;
      this.nTimerID = null;
      this.reset();
      this.setMessage( '' );
    },
    updateCombinationMessage () {
      this.setMessage( this.getFormattedCombination( this.nCombinationIndex ) )
    },
    updateCallback () {

      //Determine if we are counting down
      if ( !this.bCountdownFinished ) {
        // The countdown has not been finished,

        if ( this.nCountdownCycle == 0 ) {

          let messageString = `
            Get Ready... ${this.nCountdownCycle + 1 } <br/>
            <small>Next: ${this.getFormattedCombination( this.nCombinationIndex + 1 )}</small>`;
          this.setMessage( messageString );
          this.playClick( this.nCountdownCycle == 7 || this.nCountdownCycle == 3 ? 0 : 1 );
          // We've reached the end of the countdown.
          this.bCountdownFinished = true;
          this.nCountdownCycle = 7;
          if ( this.nCombinationIndex == -1 ) {
            this.nCombinationIndex == 0;
          }
          return;
        }
        else {
          // We're still counting down, update the status
          let messageString = `Get Ready... ${this.nCountdownCycle + 1}`;
          if ( this.nCombinationIndex == 0 ) {
            messageString += `<br/><small>Start With: ${this.getFormattedCombination( this.nCombinationIndex )}</small>`;
          }
          else {
            messageString += `<br/><small>Next: ${this.getFormattedCombination( this.nCombinationIndex + 1 )}</small>`;
          }
          this.setMessage( messageString );
          this.playClick( this.nCountdownCycle == 7 || this.nCountdownCycle == 3 ? 0 : 1 );
          this.nCountdownCycle--;
          return;
        }
      }
      else {
        // Countdown is over, now we're moving dots

        // Have we moved all the dots onto the current string?
        // (This matters because we don't really have to do much if we haven't)
        if ( this.nCombinationDotIndex < 3 ) {
          this.nCombinationDotIndex++;

          // No, all the dots are not yet onto this string.
          if ( this.nStringIndex == 1 && this.nCombinationDotIndex == 0 ) {
            document.querySelector( 'body' ).classList.toggle( 'resting', false );
            this.updateCombinationMessage();
          }
        }
        else {
          // Yes, all the dots are on this string.

          // Are we on the last string?
          if ( this.nStringIndex == 10 ) {
            // Yes, we are on the last string

            // Is this the last combination in the list?
            if ( this.nCombinationIndex == this.selectedCombinations.length - 1 ) {
              // Yes, this is the final combination, and we have finished the final string . We are done.

              this.updateProgress();
              document.querySelector( '#progressIndicator' ).style.width = '100%';
              this.nStringIndex = 0;
              this.nCombinationIndex = 0;
              this.nCombinationDotIndex = 0;
              clearInterval( this.nTimerID );
              this.stop();
              this.setMessage( 'Done' );
              return;
            }
            else if ( this.nCombinationIndex < this.selectedCombinations.length - 1 ) {
              // No, this is not the last combination, but we have reached the last string.
              // At this point we need to initiate a rest, and when that rest is over, advance to
              // the next combination.


              // Determine if we should be resting
              if ( !this.bRestFinished ) {
                // Our rest is not finished.

                if ( this.nRestCycle == 0 ) {
                  // Our rest is finished.
                  var restString = `Rest... ${this.nRestCycle + 1}<br/>
                  <small>Next: ${this.getFormattedCombination( this.nCombinationIndex + 1 )}</small>`;
                  this.setMessage( restString );
                  this.playClick( 1 );
                  this.bRestFinished = true;
                  this.nRestCycle = 7;
                  return;
                }
                else {
                  if ( this.nRestCycle == 7 ) {
                    this.setDotStates( 1 );
                    document.querySelector( 'body' ).classList.toggle( 'resting', true );
                  }
                  this.playClick( ( this.nRestCycle == 7 || this.nRestCycle == 3 ) ? 0 : 1 );
                  var restString = `Rest... ${this.nRestCycle + 1 }<br/>
                  <small>Next: ${this.getFormattedCombination( this.nCombinationIndex + 1 )}</small>`;
                  this.setMessage( restString );

                  this.nRestCycle--;
                  return;
                }

              }
              else {
                // The rest has finished, let's reset it. We won't hit this again until it's time to rest again.
                this.bRestFinished = false;
                this.nRestCycle = 7;
                document.querySelector( 'body' ).classList.toggle( 'resting', false );

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
          }
          else if ( this.nStringIndex < 10 ) {
            // We've hit the last dot, but we're not on the last string.
            this.nStringIndex++;
            this.updateProgress();
            this.nCombinationDotIndex = 0;
          }
        }


        let whichDot = this.currentCombo[this.nCombinationDotIndex] - 1;
        this.playClick( this.nCombinationDotIndex );
        this.moveDot( whichDot );
      }
    },
    reset () {
      this.dotStrings = [1, 1, 1, 1];
      this.dotDirections = [1, 1, 1, 1];
      this.nCombinationIndex = 0;
      this.nCombinationDotIndex = -1;
      this.nStringIndex = 1;
      // this.selectedCombinations =[];

      this.nRestCycle = 7;
      this.bRestFinished = false;
      this.nCountdownCycle = 7;
      this.bCountdownFinished = false;

      document.querySelector( '.first' )?.classList.toggle( 'first', false );
      document.querySelector( '.second' )?.classList.toggle( 'second', false );
      document.querySelector( '.third' )?.classList.toggle( 'third', false );
      document.querySelector( '.fourth' )?.classList.toggle( 'fourth', false );
      // document.querySelectorAll( '.dot' ).forEach( el => {
      //   el.style.display = 'none';
      // })



      this.setDotsFirstPosition();

      this.setMessage( "" );
    this.updateCombinationMessage();
    },
    setDotStates ( nOffset = 0 ) {
      let selected = this.selectedCombinations[this.nCombinationIndex + nOffset];
      let activeCombination = opts[selected.split('-')[1]]
      //$('.dot').fadeTo( 200, .5, function(){
      document.querySelectorAll( '.dot' ).forEach( el => {
        el.style.display = "block";
      })
      document.querySelector( '.first' )?.classList.toggle( 'first', false );
      document.querySelector( '.second' )?.classList.toggle( 'second', false );
      document.querySelector( '.third' )?.classList.toggle( 'third', false );
      document.querySelector( '.fourth' )?.classList.toggle( 'fourth', false );
      document.querySelector( '#dot' + activeCombination[0] )?.classList.toggle( 'first' );
      document.querySelector( '#dot' + activeCombination[1] )?.classList.toggle( 'second' );
      document.querySelector( '#dot' + activeCombination[2] )?.classList.toggle( 'third' );
      document.querySelector( '#dot' + activeCombination[3] )?.classList.toggle( 'fourth' );
      //	$('.dot').fadeTo( 800, 1.0 );
      //});
      return this;
    },
    setDotsFirstPosition () {
      this.moveDotToString( 0, 1 );
      this.moveDotToString( 1, 1 );
      this.moveDotToString( 2, 1 );
      this.moveDotToString( 3, 1 );
    },
    moveDot ( whichDot ) {
      // determine string/direction
      this.dotStrings[whichDot] += this.dotDirections[whichDot];
      if ( this.dotStrings[whichDot] == 6 || this.dotStrings[whichDot] == 1 ) {
        this.dotDirections[whichDot] *= -1;
      }

      let theDot = document.querySelector( `#dot${whichDot + 1}` )
      let newTop = this.calculateTop( this.dotStrings[whichDot], whichDot );
      let newLeft = this.calculateLeft( whichDot );

      console.log( 'b4', { top: theDot.style.top, left: theDot.style.left } )
      theDot.style.top = `${newTop}px`;
      theDot.style.left = `${newLeft}px`;
      console.log( 'after', { top: theDot.style.top, left: theDot.style.left } )
    },
    moveDotToString ( whichDot, whichString ) {
      let theDot = document.querySelector( `#dot${whichDot + 1}` )
      let newTop = this.calculateTop( whichString, whichDot );
      let newLeft = this.calculateLeft( whichDot );

      // console.log( 'b4', { top: theDot.getBoundingClientRect().top, left: theDot.getBoundingClientRect().left } )
      theDot.style.top = `${newTop}px`;
      theDot.style.left = `${newLeft}px`;
      // console.log( 'after', { top: theDot.style.top, left: theDot.style.left } )

    },
    calculateTop ( string, whichDot ) {
      var dotIndex = whichDot + 1;
      var dotHeight = document.querySelector( `#dot${dotIndex}` ).clientHeight;
      var stringTop = document.querySelector( `#string${string}` ).getBoundingClientRect().top;
      var offsetTop = stringTop - ( dotHeight / 2.0 );
      return offsetTop;
    },
    calculateLeft ( whichDot ) {
      let dotIndex = whichDot + 1;
      let rightFret = dotIndex + 2;
      let leftFret = dotIndex + 1;
      let leftSide = document.querySelector( `#fret${leftFret}` ).getBoundingClientRect().left;
      let rightSide = document.querySelector( `#fret${rightFret}` ).getBoundingClientRect().left;
      let gapWidth = rightSide - leftSide;
      let centerLine = leftSide + ( gapWidth / 2.0 );
      let dotWidth = document.querySelector( `#dot${dotIndex}` ).offsetWidth;
      let offsetLeft = centerLine - ( dotWidth / 2.0 );
      return offsetLeft;

    },

  }
}
</script>

<style>
html {
  padding: 0;
  margin: 0;
  font-size: 100%;
}

body {

  font-family: Helvetica, Verdana, Sans-serif;
  color: white;
  font-weight: 400;
  margin: 0;
  background: #222;
}

#pageWrapper {
  float: left;
  width: 100%;
}

#main {
  font-family: 'Audiowide', cursive;
  position: absolute;
  width: 100%;
  left: 0;
  top: 3rem;
  bottom: 0;
  background: #181818;
  z-index: -1;
}

.fretboard {
  position: relative;
  background-color: #363636;
  width: 100%;
  left: 0;
  top: 0%;
  right: 0;
  height: 50%;
  border-top: 2px solid #777;
  border-bottom: 2px solid #777;
  box-shadow: 0px 5px 20px #222;
  transition: opacity .3s, background-color .5s;
}


.string {
  position: absolute;
  z-index: 100;
  width: 100%;
  height: 1px;
  background: #ddd;
  box-shadow: 2px 0px 10px #000;
  min-height: 1px;
}

.string#string1 {
  top: 3%;
  height: .25vmin;
  min-height: 1px;
}

.string#string2 {
  top: 21.8%;
  height: .35vmin;
}

.string#string3 {
  top: 40.6%;
  height: .35vmin;
}

.string#string4 {
  top: 59.4%;
  height: .5vmin;
}

.string#string5 {
  top: 78.2%;
  height: .5vmin;
}

.string#string6 {
  top: 96%;
  height: .65vmin;
}

.fret {
  z-index: 50;
  position: absolute;
  top: 0;
  height: 100%;
  width: 5px;
  background: #aaa;
  border-radius: 10px;
}

#fret1 {
  left: 2%;
}

#fret2 {
  left: 18%;
}

#fret3 {
  left: 34%;
}

#fret4 {
  left: 50%
}

#fret5 {
  left: 66%;
}

#fret6 {
  left: 82%;
}

#fret7 {
  left: 98%;
}

.dot {
  position: absolute;
  width: 7vmin;
  height: 7vmin;
  background: #09f;
  border-radius: 4vmin;
  color: white;
  text-align: center;
  line-height: 7vmin;
  font-size: 3vmin;
  font-family: Audiowide;
  z-index: 150;
  top: -4%;
  box-shadow: 1px 1px 5px #222;
  border: none;
  display: none;
  transition: transform 1s, opacity .25s, top .1s, background-color 1s;
}

#dot1 {
  left: 24.5%;

}


#dot2 {
  left: 40.5%;
}


#dot3 {
  left: 56%;
}


#dot4 {
  left: 72.3%;
}


.first {
  background: #0066ff;
  border: 3px solid white;
  color: white;
  transform: scale(1.2);
}

.second {
  background: #0066ff;
  color: #ddd;
  border: 2px solid #ddd;
  transform: scale(.9);
}

.third {
  background: #999;
  border: 3px solid white;
  color: white;
  transform: scale(1.1);
}

.fourth {
  background: #999 !important;
  color: white;
  border: 2px solid #ddd;
  transform: scale(.8);
}


label {
  display: inline-block;
  color: white;
}


.non-breaking {
  white-space: nowrap;
}

/*
input[type=text]
{
	border: 1px solid white;
	line-height: 1.6em;
	font-size: .9rem;
	padding: 0 .25em;
	color: #333;
	border-radius: .25em;
	width: auto;
	display: inline-block;
}
input[type=text]:disabled
{
	background: #aaa;
	border: 1px solid #bbb;
	color: #777;
}
input[type=checkbox]
{
	border: none;
	background: white;
	display: inline-block;
	line-height: 1.2rem;
	margin: 0 .25rem 0 0;
	cursor: pointer;
}
input[type=checkbox]+label
{
	font-family: Helvetica, Arial, sans-serif;
	font-weight: bold;
	line-height: 1.2rem;
	font-size: .8rem;
	display: inline-block;
	cursor: pointer;
}


input[type=checkbox].comboCheckbox+label
{
}
input[type=checkbox]:disabled+label
{
	color: #999;
}
input[type=checkbox].comboCategoryCheckbox
{
}
input[type=checkbox].comboCategoryCheckbox+label
{
	text-transform: uppercase;
	font-weight: 900;
} */



#headerWrapper {
  width: 100%;
  height: 25%;
  padding: 1rem;
  box-sizing: border-box;
  position: relative;
}

#message {
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  font-size: 5.0vmin;
  text-align: center;
  line-height: 1em;
  font-family: Audiowide;

}

#message small {
  font-size: 70%;
}

#indexCount {
  text-align: right;
  font-size: 1.2rem;
  position: absolute;
  right: 1rem;
}

#nextUp {
  display: none;
  font-size: 2.3vmin;
  color: #ccc;
  text-transform: uppercase;
  text-align: center;
  margin-top: 1rem;
}

button {
  background: #999;
  border: none;
  line-height: 2.4em;
  cursor: pointer;
  font-size: .7rem;
  padding: 0 1em;
  ;
  font-family: Helvetica;
  color: white;
  border-radius: 3px;
  border: 1px solid #999;
}

button:disabled,
button:disabled:hover {
  background: #999;
  color: #aaa;
  border-color: #656565;
  cursor: default;
}

button:hover {
  border-color: #bbb;
  background: #a6a6a6;
  color: white;
}

body.resting .string,
body.resting .fret,
body.resting .inlay {
  opacity: .4;
}

body.resting .dot {
  opacity: .95;
}

body.resting .fretboard {
  background-color: #333;
  border-color: #444;
}

.inlay {
  position: absolute;
  top: 0;
  width: 5vmin;
  height: 5vmin;
  border-radius: 50%;
  background: #ddd;
}

#inlay1 {
  left: 25%;
  top: 45.5%;
}

#inlay2,
#inlay3 {
  left: 73%;
}

#inlay2 {
  top: 21%;
}

#inlay3 {
  top: 70%;
}

#progressBarWrapper {
  position: absolute;
  top: 75%;
  left: 0px;
  bottom: 0px;
  height: 25%;
  width: 100%;
}

.progress-wrapper {
  height: 2rem;
  border: 1px solid #555;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  width: 50%;
  left: 25%;
  border-radius: 1rem;
  background: #333;
  box-shadow: inset 0px -5px 20px #222;
  overflow: hidden;
}

.progress-wrapper .progress-indicator {
  background: #0af;
  position: absolute;
  left: 0;
  width: 0%;
  height: 2rem;
  box-shadow: 2px 0px 15px #333, inset -5px 5px 10px #7bf;
  transition: width .25s;
}

#topbar {
  position: absolute;
  top: 0;
  width: 100%;
  border-bottom: 1px solid #555;
  background: #444;
  z-index: 10;
  text-align: center;
  font-size: 0px;
}

#playbackControls {
  margin: 0 auto;
  text-align: center;
  font-size: 0;
}


.control-bar-input-wrapper,
.control-bar-button {
  display: inline-block;
  height: 3rem;
  line-height: 3rem;
  font-size: .9rem;
  padding: 0 1.5rem;
  border-radius: 0px;
  box-sizing: border-box;
  background: none;
  border: none;
  border-left: 1px solid #777;
}

.control-bar-button {
  line-height: 3rem;
  font-size: 1.2rem;
  cursor: pointer;
}

.control-bar-button:last-child {
  border-right: 1px solid #777;
}

.control-bar-button:hover {
  background: #606060;
  border-color: #777;
}

.control-bar-button:focus {
  outline: none;
}

.control-bar-button:disabled,
.control-bar-button:disabled:hover {
  background: #363636;
  text-shadow: none;
  color: #555;
}

.control-bar-button.active {
  background: #0af;
}


#combinationCount {
  font-size: .8rem;
  vertical-align: top;
  margin-left: .25rem;
  margin-top: -.25rem;
  display: inline-block;
}



@media (min-width: 0px) {
  .control-bar-button {
    font-size: .9rem;
    padding: 0 1rem;
  }

}
</style>
