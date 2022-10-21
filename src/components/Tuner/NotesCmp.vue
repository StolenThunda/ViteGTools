<template lang="">
  <section ref="notes" class="notes">
    <div ref="notesList" class="notes-list"></div>
    <div ref="frequency" class=" frequency text-h5">
    <span/>&nbsp;Hz
    </div>
    <div>{{ tuner.message }}</div>
  </section>
</template>
<script setup>
import { onMounted, watch, ref} from "vue";
import { useTunerStore } from "src/stores/Tuner";
const tuner = useTunerStore();

const props = defineProps( {
  note: {
    type: Object,
    default: () => ( {
      name: "A",
      frequency: a4,
      octave: 4,
      value: 69,
      cents: 0,
    } )
  }
})
const isAutoMode = ref( true );
// const notes = ref( null )
const notesList = ref( null )
const frequency = ref(null);
let $notes = [];
let $notesMap = {};
// let currentNote = ref(props.note)
// watch( currentNote, () => update, { deep: true } )

onMounted( () => {
  $notes = [];
  const minOctave = 2;
  const maxOctave = 5;
  for ( var octave = minOctave; octave <= maxOctave; octave += 1 ) {
    for ( var n = 0; n < 12; n += 1 ) {
      const $note = document.createElement( "div" );
      $note.className = "note";
      $note.dataset.name = tuner.noteStrings[n];
      $note.dataset.value = 12 * ( octave + 1 ) + n;
      $note.dataset.octave = octave.toString();
      $note.dataset.frequency = tuner.getStandardFrequency(
        $note.dataset.value
      );
      $note.innerHTML =
        $note.dataset.name[0] +
        '<span class="note-sharp">' +
        ( $note.dataset.name[1] || "" ) +
        "</span>" +
        '<span class="note-octave">' +
        $note.dataset.octave +
        "</span>";
      notesList.value.appendChild( $note );
      $notes.push( $note );
      $notesMap[$note.dataset.value] = $note;
    }
  }


  $notes.forEach( function ( $note ) {
    $note.addEventListener( "click", function () {
      if ( isAutoMode ) {
        return;
      }

      const $active = $notesList.querySelector( ".active" );
      if ( $active === this ) {
        self.tuner.stop();
        $active.classList.remove( "active" );
      } else {
        self.tuner.play( this.dataset.frequency );
        self.update( $note.dataset );
      }
    } );
  } );
  update()
} );

const active = function ( $note ) {
  // ConsoleMessage("active note:", $note);
  clearActive();
  $note.classList.add( "active" );
  notesList.value.scrollLeft =
    $note.offsetLeft - ( notesList.value.clientWidth - $note.clientWidth ) / 2;
};

const clearActive = function () {
  const $active = notesList.value.querySelector( ".active" );
  if ( $active )   $active.classList.remove( "active" );
};


const update = (note ) => {
  // ConsoleMessage("update note val", note.value);
  note = (!note) ? props.note : note
  console.log(note)
  if (note.value in $notesMap ) {
    active( $notesMap[note.value] );
    frequency.value.childNodes[0].textContent = parseFloat(
      note.frequency
    ).toFixed( 1 );
  }
  }

const toggleAutoMode = function () {
  if ( isAutoMode ) {
    clearActive();
  } else {
    tuner.stop();
  }
  isAutoMode = !isAutoMode;
};
defineExpose( { isAutoMode, update, toggleAutoMode } )

</script>
<style lang="scss">
.notes {
  margin: auto;
  width: 400px;
  position: fixed;
  top: 50%;
  left: 0;
  right: 0;
  text-align: center;
  color: #fff;
}

.note {
  font-size: 90px;
  font-weight: bold;
  position: relative;
  display: inline-block;
  padding-right: 30px;
  padding-left: 10px;
}

.note.active {
  color: #ef6c00;
}

.notes-list {
  overflow: auto;
  overflow: -moz-scrollbars-none;
  white-space: nowrap;
  -ms-overflow-style: none;
  -webkit-mask-image: -webkit-linear-gradient(left,
      rgba(255, 255, 255, 0),
      #fff,
      rgba(255, 255, 255, 0));
}

.notes-list::-webkit-scrollbar {
  display: none;
}

.note {
  -webkit-tap-highlight-color: transparent;
}

.note span {
  position: absolute;
  right: 0.25em;
  font-size: 40%;
  font-weight: normal;
}

.note-sharp {
  top: 0.3em;
}

.note-octave {
  bottom: 0.3em;
}
</style>
