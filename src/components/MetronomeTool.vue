<template>
  <div>
    <q-page>


      <div class="fit row justify-between justify-evenly content-center ">
        <div class="col-5-lg row ">
          <!-- size="10px" -->
          <div class="column q-pa-lg q-ma-lg q-mt-xl">

            <q-btn
              glossy
              round
              size="3rem"
              :icon="store.isPlaying ? 'mdi-pause' : 'mdi-play'"
              color="accent"
              @click="store.play"
            />
          </div>
          <div class="q-pa-lg q-ma-lg ">
            <div class="">
              <span class='text-h5'>Tempo</span>
              <p><span class="text-h3">{{store.tempo }}</span> bpm</p>
              <q-slider
                v-model="store.tempo"
                :min="0"
                :max="250"
              />
            </div>
            <div>
              <span class='text-h5'>Meter</span>
              <p><span class="text-h3">{{store.meter }}</span> counts</p>
              <q-slider
                v-model="store.meter"
                :min="0"
                :max="12"
              />
            </div>

          </div>
        </div>
        <div class="q-px-md col-7">
          <span class="text-h4">Volumes</span>
          <section class="column">
            <div v-for="name in store.volumeNames" :key="name" class="column">
            <span class="text-h5">{{ capitalize(name) }} <span class="text-caption">( {{ store[`${name}Volume`] }}% )</span></span>
            <q-slider
              v-model="store[`${name}Volume`]"
              label
              font-size="1.2rem"
              size="4rem"
              color="accent"
            >

            </q-slider>
          </div>

          </section>

        </div>
      </div>
      <!-- <q-page-sticky
        position="top-left"
        :offset="[100, 40]"
      > -->

      <!-- </q-page-sticky> -->
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
const capitalize =( string ) => {
  return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
}

</script>
