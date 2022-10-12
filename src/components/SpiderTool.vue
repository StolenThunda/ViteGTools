<template>
  <q-page :class="store.resting">
    <q-toolbar inset>
      <q-space />
      <q-btn
        icon="fa fa-check-square"
        glossy
        v-ripple
        :label="store.comboCount > 0 ? `(${store.comboCount})`:''"
        :disabled="store.bIsRunning"
      >
        <q-menu
          class="dropdown-pane dark large"
          id="sidebar-dropdown"
          v-model="showCombos"
        >
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label>Toggle all Combinations</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-toggle
                  glossy
                  dense
                  checked-icon="check"
                  color="green"
                  unchecked-icon="clear"
                  v-model="store.bAllChecks"
                />
              </q-item-section>
            </q-item>
            <q-separator
              inset
              dark
            />
            <q-item id="combinations">
              <div id="combinationSelector">
                <div class="row">
                  <div class="columns small-6 medium-3 q-px-md">
                    <div class="text-center">1st</div>
                    <div class="non-breaking">
                      <input
                        class="checkbox comboCategoryCheckbox"
                        type="checkbox"
                        id="all-1"
                        v-model="store.all_1"
                        @change="checkSet(1, this.checked, this)"
                      />&nbsp;<label for="all-1">All</label>
                    </div>
                    <q-option-group
                      v-model="store.selectedCombinations"
                      :options="generatedCheckOpts.slice(0, 6)"
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
                        v-model="store.all_2"
                        @change="checkSet(2, this.checked)"
                      />&nbsp;<label for="all-2">All</label>
                    </div>
                    <q-option-group
                      v-model="store.selectedCombinations"
                      :options="generatedCheckOpts.slice(6, 12)"
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
                        v-model="store.all_3"
                        @change="checkSet(3, this.checked)"
                      />&nbsp;<label for="all-3">All</label>
                    </div>
                    <q-option-group
                      v-model="store.selectedCombinations"
                      :options="generatedCheckOpts.slice(12, 18)"
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
                        v-model="store.all_4"
                        @change="checkSet(4, this.checked)"
                      />&nbsp;<label for="all-4">All</label>
                    </div>
                    <q-option-group
                      v-model="store.selectedCombinations"
                      :options="generatedCheckOpts.slice(18)"
                      :class="`checkbox comboCheckbox finger-4`"
                      type="checkbox"
                    />
                  </div>
                </div>
              </div>
            </q-item>
            </q-list>
            </q-menu>
            </q-btn>
            <q-input
              id="tempo"
              type="number"
              label="BPM"
              v-model="store.tempo"
              size="4"
              :disable="store.bIsRunning"
              standout
              dense
            />
            <q-btn
              id="play"
              @click="start"
              :disabled="store.comboCount === 0 && !store.bIsRunning"
              :active="store.bIsRunning"
              glossy
              v-ripple
            >
              <i
                v-show="store.bIsRunning"
                class="fa fa-pause"
              ></i>
              <i
                v-show="!store.bIsRunning"
                class="fa fa-play"
              ></i>
            </q-btn>
            <q-btn
              glossy
              v-ripple
              id="stop"
              @click="stop"
              :disabled="!store.bIsRunning"
            >
              <i class="fa fa-stop"></i>
            </q-btn>
      <q-space />
      <!-- <button class="control-bar-button" id="loop"><i class="fa fa-refresh"></i></button> -->
    </q-toolbar>

    <div id="main">
      <div id="headerWrapper">
        <div id="message" v-html="store.messageString"></div>
      </div>
      <div class="fretboard">
        <div class="fretboard-mask">
          <div class="string" id="string1"></div>
          <div class="string" id="string2"></div>
          <div class="string" id="string3"></div>
          <div class="string" id="string4"></div>
          <div class="string" id="string5"></div>
          <div class="string" id="string6"></div>
          <div class="fret" id="fret1"></div>
          <div class="fret" id="fret2"></div>
          <div class="fret" id="fret3"></div>
          <div class="fret" id="fret4"></div>
          <div class="fret" id="fret5"></div>
          <div class="fret" id="fret6"></div>
          <div class="fret" id="fret7"></div>
          <div class="dot" id="dot1">1</div>
          <div class="dot" id="dot2">2</div>
          <div class="dot" id="dot3">3</div>
          <div class="dot" id="dot4">4</div>
        </div>
      </div>
      <div id="progressBarWrapper">
        <div id="progressBar" class="progress-wrapper">
          <div class="progress-indicator" id="progressIndicator" ></div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: "SpiderTool",
}
</script>
<script setup>
import { ref, watch } from "vue";
import { useSpiderStore } from "/src/stores/spider";
import { onMounted } from "vue";

const showCombos = ref( false );
const store = useSpiderStore();

const generatedCheckOpts = store.allCombinations.map( ( el, idx ) => {
    return {
      label: el.join( " " ),
      value: `combo-${idx}`,
      id: `combo-${idx}`,
    };
    // generatedCheckOpts.push( objOption );
  } );

const checkAll = () => {
  // load selectedCombinations
  if ( store.bAllChecks ) {
    for ( let i = 0; i < store.allCombinations.length; i++ ) {
      store.selectedCombinations.push( `combo-${i}` );
    }
  } else {
    store.selectedCombinations = [];
  }
  //
  for ( let i = 1; i <= 4; i++ ) {
    store[`all_${i}`] = store.bAllChecks;
  }
};
const checkSet = ( nIndex = 1, bChecked = true, obj = null ) => {
  // get value for set "all"
  bChecked = store["all_" + nIndex];

  // determine combo group
  let end = 6 * nIndex;
  let start = end - 6;

  for (let i = start; i < end; i++) {
    // get id for checkboxes
    let combo = `combo-${i}`;
    // toggle selection
    if (bChecked) {
      store.selectedCombinations.push(combo);
    } else {
      store.selectedCombinations = store.selectedCombinations.filter(
        (el) => el === combo
      );
    }
  }
};
const resetUI = () => {
  document.querySelector( ".first" )?.classList.toggle( "first", false );
  document.querySelector( ".second" )?.classList.toggle( "second", false );
  document.querySelector( ".third" )?.classList.toggle( "third", false );
  document.querySelector( ".fourth" )?.classList.toggle( "fourth", false );
  setDotsFirstPosition();
  store.updateCombinationMessage();
};
const setDotStates = ( nOffset = 0 ) => {
  let selected =
    store.selectedCombinations[store.nCombinationIndex + nOffset];
  let activeCombination = store.allCombinations[selected.split( "-" )[1]];
  //$('.dot').fadeTo( 200, .5, function(){
  document.querySelectorAll( ".dot" ).forEach( ( el ) => {
    el.style.display = "block";
  } );
  document.querySelector( ".first" )?.classList.toggle( "first", false );
  document.querySelector( ".second" )?.classList.toggle( "second", false );
  document.querySelector( ".third" )?.classList.toggle( "third", false );
  document.querySelector( ".fourth" )?.classList.toggle( "fourth", false );
  document
    .querySelector( "#dot" + activeCombination[0] )
    ?.classList.toggle( "first" );
  document
    .querySelector( "#dot" + activeCombination[1] )
    ?.classList.toggle( "second" );
  document
    .querySelector( "#dot" + activeCombination[2] )
    ?.classList.toggle( "third" );
  document
    .querySelector( "#dot" + activeCombination[3] )
    ?.classList.toggle( "fourth" );
  //	$('.dot').fadeTo( 800, 1.0 );
  //});
  // return this;
};
const setDotsFirstPosition = () => {
  moveDotToString( 0, 1 );
  moveDotToString( 1, 1 );
  moveDotToString( 2, 1 );
  moveDotToString( 3, 1 );
};
const moveDot = ( whichDot ) => {
  // determine string/direction
  store.dotStrings[whichDot] += store.dotDirections[whichDot];
  if ( store.dotStrings[whichDot] == 6 || store.dotStrings[whichDot] == 1 ) {
    store.dotDirections[whichDot] *= -1;
  };

  let theDot = document.querySelector( `#dot${whichDot + 1}` );
  let newTop = calculateTop( store.dotStrings[whichDot], whichDot );
  let newLeft = calculateLeft( whichDot );

  theDot.style.top = `${newTop}px`;
  theDot.style.left = `${newLeft}px`;
};
const moveDotToString = ( whichDot, whichString ) => {
  let theDot = document.querySelector( `#dot${whichDot + 1}` );
  let newTop = calculateTop( whichString, whichDot );
  let newLeft = calculateLeft( whichDot );
  theDot.style.top = `${newTop}px`;
  theDot.style.left = `${newLeft}px`;
};
const calculateTop = ( string, whichDot ) => {
  var dotIndex = whichDot + 1;
  var dotHeight = document.querySelector( `#dot${dotIndex}` ).offsetHeight;
  var stringTop = document.querySelector( `#string${string}` ).offsetTop;
  var offsetTop = stringTop - dotHeight / 2.0;
  return offsetTop;
};
const calculateLeft = ( whichDot ) => {
  let dotIndex = whichDot + 1;
  let rightFret = dotIndex + 2;
  let leftFret = dotIndex + 1;
  let leftSide = document
    .querySelector( `#fret${leftFret}` )
    .getBoundingClientRect().left;
  let rightSide = document
    .querySelector( `#fret${rightFret}` )
    .getBoundingClientRect().left;
  let gapWidth = rightSide - leftSide;
  let centerLine = leftSide + gapWidth / 2.0;
  let dotWidth = document.querySelector( `#dot${dotIndex}` ).offsetWidth;
  let offsetLeft = centerLine - dotWidth / 2.0;
  return offsetLeft;
};
const stop = () => {
  resetUI()
  store.stop()
  store.$reset()
}
onMounted( () => {
  resetUI()
} );

watch(
  () => store.bAllChecks,
  checkAll
)

watch(
  () => store.whichDot,
  () => moveDot(store.whichDot)
)
watch(
  () => store.dotState,
  () => {
    setDotStates(store.dotState)
  }
)
watch(
  () => store.progress,
  () => {
    document.querySelector('#progressIndicator').style.width = store.progress
  }
)

const start = () => {
  store.toggleRun();
  setDotStates();
  setDotsFirstPosition();
}
</script>

<style>
html {
  padding: 0;
  margin: 0;
  font-size: 100%;
  box-sizing: border-box;
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
  font-family: "Audiowide", cursive;
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
  transition: opacity 0.3s, background-color 0.5s;
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
  height: 0.25vmin;
  min-height: 1px;
}

.string#string2 {
  top: 21.8%;
  height: 0.35vmin;
}

.string#string3 {
  top: 40.6%;
  height: 0.35vmin;
}

.string#string4 {
  top: 59.4%;
  height: 0.5vmin;
}

.string#string5 {
  top: 78.2%;
  height: 0.5vmin;
}

.string#string6 {
  top: 96%;
  height: 0.65vmin;
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
  left: 50%;
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
  transition: transform 1s, opacity 0.25s, top 0.1s, background-color 1s;
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
  transform: scale(0.9);
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
  transform: scale(0.8);
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
  font-size: 5vmin;
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
  font-size: 0.7rem;
  padding: 0 1em;
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
  opacity: 0.4;
}

body.resting .dot {
  opacity: 0.95;
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
  transition: width 0.25s;
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
  font-size: 0.9rem;
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
  font-size: 0.8rem;
  vertical-align: top;
  margin-left: 0.25rem;
  margin-top: -0.25rem;
  display: inline-block;
}

@media (min-width: 0px) {
  .control-bar-button {
    font-size: 0.9rem;
    padding: 0 1rem;
  }
}
</style>
