<template>
  <div class="min-h-screen transition-colors duration-300">
    <div class="p-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-indigo-950">
      <div class="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl overflow-hidden">
        <form @submit.prevent="submitForm" class="p-8">
          <h2 class="text-4xl font-extrabold text-center text-indigo-800 dark:text-yellow-400 mb-8 uppercase tracking-wide">
            {{ isEditing ? 'Edit' : 'Create your' }} Superhero!
          </h2>
          <div class="mb-6">
            <input v-model="superhero.name" placeholder="Superhero Name" required
              class="w-full px-4 py-2 bg-indigo-50 dark:bg-gray-700 text-indigo-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-400 dark:focus:ring-yellow-400 focus:outline-none transition duration-300" />
          </div>
          <div class="mb-6">
            <label for="image" class="block w-full px-4 py-2 bg-indigo-100 dark:bg-gray-700 text-indigo-800 dark:text-white rounded-lg cursor-pointer hover:bg-indigo-200 dark:hover:bg-gray-600 transition duration-300 text-center">
              <span class="mr-2">🦸</span>
              {{ superhero.picture ? 'Change Image' : 'Upload Image' }}
            </label>
            <input type="file" id="image" @change="onImageChange" accept="image/*" class="hidden" />
          </div>
          <div v-if="superhero.picture" class="mb-6 flex justify-center">
            <div class="w-32 h-32 flex items-center justify-center border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden">
              <img :src="superhero.picture" alt="Superhero" class="w-32 h-32 object-cover" />
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div v-for="(value, key) in superhero.attributes" :key="key" class="flex flex-col items-center">
              <label :for="key" class="text-indigo-800 dark:text-white text-lg mb-2 capitalize">{{ key }}</label>
              <input :id="key" v-model.number="superhero.attributes[key]" type="range" min="0" max="10" required
                class="w-full h-2 bg-indigo-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer" />
              <span class="text-indigo-700 dark:text-yellow-400 text-lg mt-2">{{ superhero.attributes[key] }}</span>
            </div>
          </div>
          <button type="submit"
            class="w-full bg-indigo-600 dark:bg-yellow-500 text-white dark:text-gray-900 font-bold py-3 px-4 rounded-lg hover:bg-indigo-500 dark:hover:bg-yellow-400 transition duration-300 transform hover:-translate-y-1 hover:shadow-lg">
            {{ isEditing ? 'Update' : 'Create' }} Superhero
          </button>
        </form>

        <!-- List of superheroes -->
        <div v-if="superheroes.length" class="bg-indigo-50 dark:bg-gray-900 p-8">
          <h3 class="text-3xl font-bold text-center text-indigo-800 dark:text-yellow-400 mb-8">Changes saved!</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="hero in superheroes" :key="hero.id" class="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition duration-300 transform hover:-translate-y-2 hover:shadow-2xl">
              <img :src="hero.picture" alt="Superhero Image" class="w-full h-48 object-cover" />
              <div class="p-4">
                <h4 class="text-xl font-bold text-indigo-700 dark:text-yellow-400 mb-3">{{ hero.name }}</h4>
                <div class="space-y-2">
                  <div v-for="(value, key) in hero.attributes" :key="key" class="flex items-center">
                    <span class="text-indigo-800 dark:text-white capitalize w-24">{{ key }}</span>
                    <div class="flex-grow bg-indigo-100 dark:bg-gray-700 rounded-full h-2 ml-2">
                      <div class="bg-indigo-600 dark:bg-yellow-400 h-2 rounded-full" :style="{ width: `${value * 10}%` }"></div>
                    </div>
                  </div>
                </div>
                <div class="mt-4 flex justify-between">
                  <button @click="editHero(hero)" class="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 transition duration-300">Edit</button>
                  <button @click="deleteHero(hero.id)" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';
import { Superhero } from '../types/superhero';

export default defineComponent({
  name: 'SuperheroForm',
  props: {
    initialHero: {
      type: Object as PropType<Partial<Superhero>>,
      default: () => ({}),
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['submit'],
  setup(props, { emit }) {
    const superheroes = ref<Superhero[]>([]);

    const superhero = ref<Omit<Superhero, 'id' | 'createdAt' | 'updatedAt'>>({
      name: props.initialHero.name || '',
      picture: props.initialHero.picture || '',
      attributes: props.initialHero.attributes || {
        agility: 0,
        strength: 0,
        weight: 0,
        endurance: 0,
        charisma: 0,
      },
    });

    const onImageChange = (event: Event) => {
      const target = event.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target?.result as string;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 128;
            canvas.height = 128;
            ctx?.drawImage(img, 0, 0, 128, 128);
            superhero.value.picture = canvas.toDataURL();
          };
        };
        reader.readAsDataURL(file);
      }
    };

    const submitForm = () => {
      if (superheroes.value.some(hero => hero.name === superhero.value.name)) {
        alert('Superhero name must be unique');
        return;
      }
      superheroes.value.push({
        id: Date.now(),
        ...superhero.value,
      });
      emit('submit', superhero.value);
      resetForm();
    };

    const resetForm = () => {
      superhero.value = {
        name: '',
        picture: '',
        attributes: {
          agility: 0,
          strength: 0,
          weight: 0,
          endurance: 0,
          charisma: 0,
        },
      };
    };

    const editHero = (hero: Superhero) => {
      superhero.value = { ...hero };
    };

    const deleteHero = (id: number) => {
      superheroes.value = superheroes.value.filter(hero => hero.id !== id);
    };

    return {
      superhero,
      superheroes,
      submitForm,
      onImageChange,
      editHero,
      deleteHero,
    };
  },
});
</script>