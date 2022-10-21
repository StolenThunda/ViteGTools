
<script setup>
import { onMounted, watch } from "vue";
import { useTunerStore } from "src/stores/Tuner";

const tuner = useTunerStore()
const emit = defineEmits( ['onNoteDetected'] )
const record = tuner.startRecord
defineExpose( { record } )
onMounted(() => tuner.init())
watch( () => tuner.NoteDetected,
  () => emit('onNoteDetected', tuner.NoteDetected)
)
</script>
<style lang="">

</style>
