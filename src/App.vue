<template>
  <div id="app" :class="{ 'dark': isDarkMode }">
    <nav class="p-4 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div class="max-w-6xl mx-auto flex justify-between items-center">
        <div class="space-x-4">
          <router-link to="/" class="text-black dark:text-white hover:text-indigo-600 dark:hover:text-yellow-400 transition duration-300">Home</router-link>
          <router-link to="/superheros" class="text-black dark:text-white hover:text-indigo-600 dark:hover:text-yellow-400 transition duration-300">Manage Superheroes</router-link>
          <router-link to="/pentatlon" class="text-black dark:text-white hover:text-indigo-600 dark:hover:text-yellow-400 transition duration-300">Pentatlon Simulation</router-link>
        </div>
        <button @click="toggleDarkMode" class="px-4 py-2 rounded-full bg-indigo-100 dark:bg-gray-700 text-indigo-800 dark:text-yellow-400 hover:bg-indigo-200 dark:hover:bg-gray-600 transition duration-300">
          {{ isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode' }}
        </button>
      </div>
    </nav>
    <main class="p-4 bg-white dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <router-view/>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'

export default defineComponent({
  name: 'App',
  setup() {
    const isDarkMode = ref(true);

    onMounted(() => {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        isDarkMode.value = savedMode === 'true';
      }
    });

    watch(isDarkMode, (newValue) => {
      localStorage.setItem('darkMode', newValue.toString());
    });

    const toggleDarkMode = () => {
      isDarkMode.value = !isDarkMode.value;
    };

    return {
      isDarkMode,
      toggleDarkMode
    };
  }
})
</script>

<style>
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

@font-face {
  font-family: 'brisk_regular';
  src: url('public/brisk_regular.otf') format('opentype'), 
       url('public/brisk_regular.ttf') format('truetype'); 
  font-weight: normal;
  font-style: normal;
}

#app {
  font-family: 'brisk_regular', Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.dark {
  color-scheme: dark;
}
</style>