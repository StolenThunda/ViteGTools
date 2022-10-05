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
          Essential Links
        </q-item-label>

        <ToolLink
          v-for="link in linksList"
          :key="link.title"
          v-bind="link"
        />
        <!-- <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        /> -->
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
    icon: 'pattern',
    link: '/fretboard'
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
