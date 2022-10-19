<template lang="">
  <canvas class="frequency-bars" ref="freqBars"></canvas>
</template>
<script setup>
/*
 * @param { Uint8Array } data
  */
const update = function ( data ) {
  // ConsoleMessage(`data: ${data}`)
  const length = 64; // low frequency only
  const width = this.$canvas.width / length - 0.5;
  this.canvasContext.clearRect( 0, 0, this.$canvas.width, this.$canvas.height );
  this.canvasContext.globalAlpha = 0.35;
  for ( var i = 0; i < length; i += 1 ) {
    this.canvasContext.fillStyle = "#ef6c00";
    this.canvasContext.fillRect(
      i * ( width + 0.5 ),
      this.$canvas.height - data[i],
      width,
      data[i]
    );
  }
};
</script>
<style lang="">
  .frequency-bars {
  position: fixed;
  bottom: 0;
}
</style>