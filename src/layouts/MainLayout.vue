<template>
  <q-layout view="lHh Lpr lFf">
    <q-header >
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title class="text-h3 text-weight-bolder">
          Guitar tools
        </q-toolbar-title>

        <div class="column q-ma-sm">
          <sup>Quasar v{{ $q.version }}</sup>
          <q-btn
            flat
            dense
            round
            size="2vh"
            to="/"
            icon="home"
            aria-label="Home"
          />
          </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      bordered
      overlay
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

    <q-page-container class="overflow-hidden">
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
export default {
name: 'MainLayout',
};
</script>

<script setup>
// import 'src/middleware/monkeypatch.js'
import { ref } from 'vue'
import { linksList } from "src/components/ToolList.vue";
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
