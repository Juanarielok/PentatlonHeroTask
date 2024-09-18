<template>
  <div id="app">
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/superheros">Manage Superheroes</router-link> |
      <router-link to="/pentatlon">Pentatlon Simulation</router-link>
    </nav>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'App'
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #000000;
  margin-top: 60px;
}

body {
  background-color: rgb(0, 0, 0); 
  color: white;
}

@font-face {
  font-family: 'brisk_regular';
  src: url('public/brisk_regular.otf') format('opentype'), 
       url('public/brisk_regular.ttf') format('truetype'); 
  font-weight: normal;
  font-style: normal;
}


nav a {
  color: white; 
  text-decoration: none; 
  font-family: 'brisk_regular';
}



</style>
