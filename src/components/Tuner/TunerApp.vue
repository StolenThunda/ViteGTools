<template lang="">
  <div>
    <tuner-core >
      <notes-cmp>
      <meter-cmp />
      <frequency-bars />
    </tuner-core>
  </div>
</template>
<script setup>
import { onMounted, ref, reactive } from "vue";
let a4 = parseInt( localStorage.getItem( "a4" ) ) || 440;
const update = () => ( {
  name: "A",
  frequency: a4,
  octave: 4,
  value: 69,
  cents: 0,
} )
const tunerInit = ref(false)
onMounted( () => {
  tunerInit.value = true;
})
</script>
<style lang="">
  
</style>