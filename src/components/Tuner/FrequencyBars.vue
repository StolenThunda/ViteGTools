<template lang="">
  <canvas class="frequency-bars" ref="freqBars"></canvas>
</template>
<script setup>
  import { ref, onMounted } from "vue";

const freqBars = ref( null )
const ctxFreq = ref( null )

const reset = () => ctxFreq.value.clearRect( 0, 0, freqBars.value.width, freqBars.value.height );
/*
* @param { Uint8Array } data
*/

const needResized = () => {
  return ( freqBars.value.width === document.querySelector( '[role=tuner-app]' ).clientWidth && freqBars.value.height === document.querySelector( '[role=tuner-app]' ).clientHeight / 2 )
}
const resizeCanvas = () => {
  freqBars.value.width = document.querySelector( '[role=tuner-app]' ).clientWidth
  freqBars.value.height = document.querySelector( '[role=tuner-app]' ).clientHeight / 2
}
const update = function ( data ) {
  if ( needResized ) resizeCanvas()
  // ConsoleMessage(`data: ${data}`)
  const length = 64; // low frequency only
  const width = freqBars.value.width / length - 0.5;
  reset()
  ctxFreq.value.globalAlpha = 0.35;
  for ( var i = 0; i < length; i += 1 ) {
    ctxFreq.value.fillStyle = "#ef6c00";
    ctxFreq.value.fillRect(
      i * ( width + 0.5 ),
      freqBars.value.height - data[i],
      width + 0.8,
      data[i]
      );
    }
  };
defineExpose( { update , reset})

onMounted( () => {
  resizeCanvas()
  ctxFreq.value = freqBars.value.getContext("2d")

})
</script>
<style lang="scss">
  .frequency-bars {
  position: fixed;
  bottom: 0;
}
</style>
