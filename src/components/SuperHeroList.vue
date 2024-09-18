<template>
  <div>  // sddssd
    <h2>Your heroes</h2>
    <ul>
      <li v-for="hero in heroes" :key="hero.id">
        {{ hero.name }}
        <button @click="$emit('edit', hero)">⚙️</button>
        <button @click="$emit('delete', hero.id)">🗑️</button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Superhero } from '../types/superhero';

export default defineComponent({
  name: 'SuperheroList',
  props: {
    heroes: {
      type: Array as PropType<Superhero[]>,
      required: true
    }
  },
  emits: ['edit', 'delete']
});
</script>

<style scoped>
@font-face {
  font-family: 'brisk_regular';
  src: url('public/brisk_regular.otf') format('opentype'), 
       url('public/brisk_regular.ttf') format('truetype'); /* Keep TTF for fallback */
  font-weight: normal;
  font-style: normal;
}

ul {
  list-style-type: none;
  padding: 0;
  font-family: 'brisk_regular', sans-serif; /* Apply the font */
  color: white; /* Set font color to white */
}

h2 {
  color: white; 
}

li {
  margin: 5px 0; 
}

button {
  background-color: transparent; 
  color: white; 
  font-family: 'Times New Roman', Times, serif; 
  cursor: pointer; 
}

button:hover {
  background-color: rgba(255, 255, 255, 0.1); 
}
</style>
