<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          Guitar tools
        </q-toolbar-title>

        <div><sup>Quasar v{{ $q.version }}</sup></div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label
          header
        >
          Tools
        </q-item-label>

        <ToolLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{Component}">

        <transition name="moveUp">
          <component
            :is="Component"
            :key="$route.path"
          ></component>
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>
<script>
const linksList = [
  {
    title: 'Fretboard Navigator',
    caption: 'Scales, "Boxes" and More',
    icon: 'mdi-car-shift-pattern',
    link: '/fretboard'
  },
  {
    title: 'Metronome',
    caption: 'Working on timing',
    icon: 'mdi-metronome',
    link: '/metronome'
  },
  {
    title: 'Spider Tool',
    caption: 'Finger strengthening and dexterity',
    icon: 'mdi-spider',
    link: '/spider'
  },
  {
    title: 'Tuner',
    caption: 'Tuner',
    icon: 'mdi-tune',
    link: '/tuner'
  }
]

export default {
name: 'MainLayout',
};
</script>

<script setup>
import 'src/middleware/monkeypatch.js'
import { ref } from 'vue'
import ToolLink from "components/ToolLink.vue";

const leftDrawerOpen = ref( false )

const toggleLeftDrawer = () => leftDrawerOpen.value = !leftDrawerOpen.value;
</script>
<style>
.moveUp-enter-active {
  animation: fadeIn 1s ease-in-out;
}
@keyframes fadeIn {
  0% { opacity: 0;}
  50% {opacity: 0.5;}
  100% {opacity: 1;}
}
.moveUp-leave-active {
  animation: moveUp .4s ease-in;
}
@keyframes moveUp {
  0% {transform: translateY(0);}
  100% {transform: translateY(-400px);}
}
</style>
