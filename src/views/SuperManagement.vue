<template>
    <h1 class="text-3xl font-bold mb-6 text-center transition-colors duration-300 dark:text-yellow-400 text-blue-600">
      Edit Your Heroes!
    </h1>
  <div class="max-w-7xl mx-auto p-6 transition-colors duration-300 dark:bg-gray-800">
    <div v-if="loading" class="text-center text-xl dark:text-white">Loading...</div>
    <div v-else>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
        <div v-for="hero in heroes" :key="hero.id" class="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl">
          <img :src="hero.picture" :alt="hero.name" class="w-full h-48 object-cover">
          <h3 class="px-4 py-2 text-center text-lg font-semibold dark:text-white">{{ hero.name }}</h3>
          <div class="px-4 pb-4">
            <div v-for="(value, key) in hero.attributes" :key="key" class="flex items-center mb-2">
              <span class="font-bold mr-2 dark:text-white">{{ key }}:</span>
              <div class="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                <div class="h-full bg-blue-500" :style="{ width: (value / 10) * 100 + '%' }"></div>
              </div>
              <span class="ml-2 dark:text-white">{{ value }}</span>
            </div>
          </div>
          <div class="flex justify-around p-4">
            <button @click="startEditing(hero)" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition">Edit</button>
            <button @click="handleDeleteHero(hero.id)" class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="editingHero" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 overflow-y-auto">
      <div class="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md mx-auto">
        <div class="p-6">
          <SuperheroForm 
            @submit="handleUpdateHero" 
            :initialHero="editingHero" 
            :isEditing="true"
          />
          <button @click="cancelEditing" class="mt-4 w-full px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import SuperheroForm from '../components/SuperHeroForm.vue'
import { createApiKey, getHeroes, createHero, updateHero, deleteHero } from '../services/api'
import { Superhero } from '../types/superhero'

export default defineComponent({
  name: 'SuperheroManagement',
  components: {
    SuperheroForm
  },
  setup() {
    const heroes = ref<Superhero[]>([])
    const loading = ref(true)
    const editingHero = ref<Superhero | null>(null)

    onMounted(async () => {
      try {
        await createApiKey()
        heroes.value = await getHeroes()
      } catch (error) {
        console.error('Failed to initialize:', error)
      } finally {
        loading.value = false
      }
    })

    const handleCreateHero = async (hero: Omit<Superhero, 'id' | 'createdAt' | 'updatedAt'>) => {
      try {
        const newHero = await createHero(hero)
        heroes.value.push(newHero)
      } catch (error) {
        console.error('Failed to create hero:', error)
      }
    }

    const handleUpdateHero = async (hero: Omit<Superhero, 'id' | 'createdAt' | 'updatedAt'>) => {
      if (!editingHero.value) return
      try {
        const updatedHero = await updateHero(editingHero.value.id, hero)
        const index = heroes.value.findIndex(h => h.id === editingHero.value?.id)
        if (index !== -1) {
          heroes.value[index] = updatedHero
        }
        editingHero.value = null
      } catch (error) {
        console.error('Failed to update hero:', error)
      }
    }

    const handleDeleteHero = async (id: string) => {
      try {
        await deleteHero(id)
        heroes.value = heroes.value.filter(h => h.id !== id)
      } catch (error) {
        console.error('Failed to delete hero:', error)
      }
    }

    const startEditing = (hero: Superhero) => {
      editingHero.value = hero
    }

    const cancelEditing = () => {
      editingHero.value = null
    }

    return { 
      heroes, 
      loading, 
      editingHero, 
      handleCreateHero, 
      handleUpdateHero, 
      handleDeleteHero,
      startEditing,
      cancelEditing,
    }
  }
})
</script>