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
      <router-view />
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
import { defineComponent, ref } from 'vue'
import ToolLink from "components/ToolLink.vue";

const leftDrawerOpen = ref( false )

const toggleLeftDrawer = () => leftDrawerOpen.value = !leftDrawerOpen.value;
</script>
