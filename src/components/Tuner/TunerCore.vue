<template lang="">
  <div>
    
  </div>
</template>
<script setup>
import { useTunerStore } from "src/stores/Tuner";

const store = useTunerStore()

onMounted(() => {
  store.init()
}),

</script>
<style lang="">
  
</style>