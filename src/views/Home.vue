<template>
    <div>
      <SuperHeroForm @submit="handleCreateSuperhero" />
      <SuperHeroList :heroes="heroes" @edit="editSuperhero" @delete="deleteSuperhero" />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref, onMounted } from 'vue'
  import SuperHeroForm from '../components/SuperHeroForm.vue'
  import SuperHeroList from '../components/SuperHeroList.vue'
  import { Superhero } from '../types/superhero'
  import { getHeroes, createHero as apiCreateSuperhero, updateHero, deleteHero as apiDeleteSuperhero } from '../services/api'
  
  export default defineComponent({
    name: 'SuperheroManagement',
    components: {
      SuperHeroForm,
      SuperHeroList
    },
    setup() {
      const heroes = ref<Superhero[]>([])
  
      onMounted(async () => {
        heroes.value = await getHeroes()
      })
  
      const handleCreateSuperhero = async (superhero: Omit<Superhero, 'id' | 'createdAt' | 'updatedAt'>) => {
        const newHero = await apiCreateSuperhero(superhero)
        heroes.value.push(newHero)
      }
  
      const editSuperhero = async (id: string, updatedHero: Omit<Superhero, 'id' | 'createdAt' | 'updatedAt'>) => {
        const updatedHeroData = await updateHero(id, updatedHero)
        const index = heroes.value.findIndex(h => h.id === id)
        if (index !== -1) {
          heroes.value[index] = updatedHeroData
        }
      }
  
      const deleteSuperhero = async (id: string) => {
        await apiDeleteSuperhero(id)
        heroes.value = heroes.value.filter(h => h.id !== id)
      }
  
      return { heroes, handleCreateSuperhero, editSuperhero, deleteSuperhero }
    }
  })
  </script>