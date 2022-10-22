<template lang="">
  <div ref="meter" class="meter">
      <div class="meter-dot"></div>
      <div ref="meterPointer" class="meter-pointer"></div>
    </div>
</template>
<script setup>
import { onMounted, computed, ref } from "vue";
import { useTunerStore } from "src/stores/Tuner";
const meter = ref( null )
const meterPointer = ref( null )
const tuner = useTunerStore()
const deg = () => {
    return ( ( ( tuner.NoteDetected.cents ?? 0 ) / 50 ) * 45 )
  }
const update = () => {
  let degree = deg()
  degree = isNaN(degree) ? 0 : degree
  console.log( deg() )
  meterPointer.value.style.transform = "rotate(" + deg() + "deg)";
}

onMounted( () => {
  for ( var i = 0; i <= 10; i += 1 ) {
    const $scale = document.createElement( "div" );
    $scale.className = "meter-scale";
    $scale.style.transform = "rotate(" + ( i * 9 - 45 ) + "deg)";
    if ( i % 5 === 0 ) {
      $scale.classList.add( "meter-scale-strong" );
    }
    meter.value.appendChild( $scale );
    update(0)
  }
})
defineExpose( { update })
</script>
<style lang="css" >
* {
  color: #fff;
}
.meter {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 50%;
  width: 400px;
  height: 33%;
  margin: 0 auto 5vh auto;
}

.meter-pointer {
  width: 2px;
  height: 100%;
  background: #2c3e50;
  /* background: #fff; */
  transform: rotate(45deg);
  transform-origin: bottom;
  transition: transform 0.5s;
  position: absolute;
  right: 50%;
}

.meter-dot {
  width: 10px;
  height: 10px;
  background: #2c3e50;
  border-radius: 50%;
  position: absolute;
  bottom: -5px;
  right: 50%;
  margin-right: -4px;
}

.meter-scale {
  width: 1px;
  height: 100%;
  transform-origin: bottom;
  transition: transform 0.2s;
  box-sizing: border-box;
  border-top: 10px solid;
  position: absolute;
  right: 50%;
}

.meter-scale-strong {
  width: 2px;
  border-top-width: 20px;
}
</style>
