<template>
  <main role="tuner-app">
    <section>
      <q-btn
        @click="start"
        color="positive"
        label="Start"
      class="q-ma-md"
      size="3vh"
      rounded
        :disabled="(tuner.stopped === undefined) || tuner.stopped" />
   <q-btn
      @click="stop"
      label="Stop"
      color="negative"
      class="q-ma-md"
      size="3vh"
      rounded
      :disabled="!tuner.stopped" />
    </section>

      <notes-cmp :note="currentNote" ref='notesRef' />
      <meter-cmp ref='meterRef' />
      <frequency-bars :freqData="freqData" ref="freqBars" />
  </main>
</template>
<script setup
>
import {computed, onMounted,  ref, watch } from "vue";
import { useTunerStore } from "src/stores/Tuner";
import FrequencyBars from "./FrequencyBars.vue";
import NotesCmp from "./NotesCmp.vue";
import MeterCmp from "./MeterCmp.vue";
import { copyFile } from "fs";
const tuner = useTunerStore()

let lastNote = ""
let isPlaying = false
let frameID;
const notesRef = ref( null )
const freqData = ref(null);
const freqBars = ref( null );
const meterRef = ref( null );
let a4 = parseInt( localStorage.getItem( "a4" ) ) || 440;
let currentNote ={
  name: "A",
  frequency: a4,
  octave: 4,
  value: 69,
  cents: 0,
}
const isPlayingTest = computed( () => {
  return (isPlaying === null)
})
onMounted( () => {
  update( {
    name: "A",
    frequency: a4,
    octave: 4,
    value: 69,
    cents: 0,
  } )
} )
const onNoteDetected = ( note ) => {
  if ( !notesRef.value.isAutoMode ) return;
  currentNote = tuner.NoteDetected
  if ( lastNote !== note.name ) {
    update( note );
  } else {
    lastNote = note.name;
  }
}
const update = ( note ) => {
  currentNote = note
  notesRef.value.update( currentNote )
  let degree = ( ( ( currentNote.cents ?? 0 ) / 50 ) * 45 )
  meterRef.value.update( degree )
  // updateFrequencyBars()
}
  const updateFrequencyBars = () => {
    // if ( this.tuner.isIOS && frequencyData ) {
    //   let data = Object.values( frequencyData );
    //   if ( data.some( ( v ) => v > 0 ) ) {
    //     // ConsoleMessage(`freq obj update (${data.some((v) => v > 0)}): ${data}`);
    //     frequencyData = new Uint8Array( data );
    //   }
    // }

    if ( tuner.isAnalyserInitialized ) {
      freqData.value = new Uint8Array( tuner.getFreqBinCount );
      tuner.analyser.getByteFrequencyData( freqData.value );
      freqBars.value?.update(freqData.value)
    }
    return requestAnimationFrame( updateFrequencyBars.bind(this) )
  };
const start = () => {
  isPlaying = true
  tuner.startRecord();
  frameID = updateFrequencyBars()
  }
const stop = () => {
  if (isPlaying ) {
    tuner.stopRecord()
    cancelAnimationFrame( frameID )
    freqBars.value.reset()
    window?.audioinput?.stop();
  }else { console.log("isn't playing")}
  }

  watch(
    () => tuner.NoteDetected,
    ( newNote,oldNote ) => {
      // console.log( newNote, oldNote )
      if ( newNote.name !== '' ) {
        onNoteDetected( newNote )
      } else {
        onNoteDetected( oldNote )
      }
    }
  )

</script>
<style lang="scss">
main {
  position: fixed;
  font-family: sans-serif;
  color: #2c3e50;
  margin: 0;
  width: 100%;
  height: 100%;
  cursor: default;
  -webkit-user-select: none;
  -moz-user-select: none;
  }
</style>
