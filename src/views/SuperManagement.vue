<template>
  <div class="superhero-management">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else>
      <SuperheroForm 
        @submit="handleCreateHero" 
        :isEditing="false"
      />
      <div class="hero-list">
        <div v-for="hero in heroes" :key="hero.id" class="hero-card">
          <img :src="hero.picture" :alt="hero.name" class="hero-image">
          <h3 class="hero-name">{{ hero.name }}</h3>
          <div class="hero-attributes">
            <div v-for="(value, key) in hero.attributes" :key="key" class="hero-attribute">
              <span class="attribute-name">{{ key }}:</span>
              <div class="skill-bar">
                <div class="skill-fill" :style="{ width: (value / 10) * 100 + '%' }"></div>
              </div>
              <span class="attribute-value">{{ value }}</span>
            </div>
          </div>
          <div class="hero-actions">
            <button @click="startEditing(hero)" class="edit-button">Edit</button>
            <button @click="handleDeleteHero(hero.id)" class="delete-button">Delete</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="editingHero" class="modal">
      <div class="modal-content">
        <SuperheroForm 
          @submit="handleUpdateHero" 
          :initialHero="editingHero" 
          :isEditing="true"
        />
        <button @click="cancelEditing" class="cancel-button">Cancel</button>
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
      cancelEditing
    }
  }
})
</script>

<style scoped>
.superhero-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.main-title {
  text-align: center;
  color: #ffffff;
  margin-bottom: 30px;
}

.loading {
  text-align: center;
  font-size: 1.5em;
  color: #ffffff;
}

.hero-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 30px;
}

.hero-card {
  background-color: #ffffff00;
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.3s;
}

.hero-card:hover {
  transform: translateY(-5px);
}

.hero-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.hero-name {
  padding: 10px;
  text-align: center;
  font-size: 1.2em;
  color: #ffffff;
}

.hero-attributes {
  padding: 0 10px 10px;
}

.hero-attribute {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.skill-bar {
  flex-grow: 1;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  margin: 0 10px;
  overflow: hidden;
}

.skill-fill {
  height: 100%;
  background-color: white;
  transition: width 0.3s ease;
}

.attribute-name {
  font-weight: bold;
  color: #ffffff;
}

.attribute-value {
  color: #ffffff;
  margin-left: 5px;
}

.hero-actions {
  display: flex;
  justify-content: space-around;
  padding: 10px;
}

.edit-button, .delete-button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-button {
  background-color: #dbbc34;
  color: white;
}

.edit-button:hover {
  background-color: #b6b929;
}

.delete-button {
  background-color: #e74c3c;
  color: white;
}

.delete-button:hover {
  background-color: #c0392b;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  max-width: 500px;
  width: 100%;
}

.cancel-button {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #95a5a6;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #7f8c8d;
}
</style>
