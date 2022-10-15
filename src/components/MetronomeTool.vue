<template>
  <div>
    <q-toolbar inset>
      <q-btn
        :icon="store.isPlaying ? 'mdi-pause' : 'mdi-play'"
        round
        size="xl"
        color='accent'
        @click="store.play"
      />
    </q-toolbar>
    <q-page>

      <div class="fit row wrap justify-evenly items-center content-center">
        <div class="col-6">
          <div class="q-px-md col-6">
            <div class="">
              <span class='text-h4'>Tempo</span>
              <p><span class="text-h1">{{store.tempo }}</span> bpm</p>
              <q-slider
                v-model="store.tempo"
                :min="0"
                :max="250"
                color="green"
              />
            </div>
            <div>
              <span class='text-h4'>Meter</span>
              <p><span class="text-h1">{{store.meter }}</span> counts</p>
              <q-slider
                v-model="store.meter"
                :min="0"
                :max="12"
                color="green"
              />
            </div>

          </div>
        </div>
        <div class="q-px-md col-6">
          <span class="text-h4">Volumes</span>
          <div class="">
            <span>Master</span>
            <q-slider
              v-model="store.masterVolume"
              label
            />
          </div>
          <div class="">
            <span>Accent</span>
            <q-slider
              v-model="store.accentVolume"
              label
            />
          </div>
          <div class="">
            <span>Quarter</span>
            <q-slider
              v-model="store.quarterVolume"
              label
            />
          </div>
          <div class="">
            <span>Eighth</span>
            <q-slider
              v-model="store.eighthVolume"
              label
            />
          </div>
          <div class="">
            <span>Sixteenth</span>
            <q-slider
              v-model="store.sixteenthVolume"
              label
            />
          </div>
          <div class="">
            <span class="">Triplet</span>
            <q-slider
              v-model="store.tripletVolume"
              label
            />
          </div>
        </div>
      </div>
    </q-page>
  </div>
</template>
<script>
export default {
  name: 'MetronomeTool'
}
</script>

<script setup>
import { useMetronomeStore } from "src/stores/metronome.js";
import { onMounted } from 'vue';

const store = useMetronomeStore()
onMounted( () => {
  store.init()
} )

</script>
