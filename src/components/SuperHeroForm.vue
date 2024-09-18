<template>
  <div>
    <form @submit.prevent="submitForm" class="superhero-form">
      <h2 class="form-title">{{ isEditing ? 'Edit' : 'Create your' }} Superhero!</h2>
      <div class="input-group">
        <input v-model="superhero.name" placeholder="Superhero Name" required class="form-input" />
      </div>
      <div class="input-group">
        <label for="image" class="file-input-label">
          
          {{ superhero.picture ? 'Change Image' : 'Upload Image' }}

        </label>
        <input
          type="file"
          id="image"
          @change="onImageChange"
          accept="image/*"
          class="file-input"
        />
      </div>
      <div v-if="superhero.picture" class="image-preview">
        <img :src="superhero.picture" alt="Superhero" class="preview-img" />
      </div>
      <div class="attributes-grid">
        <div
          v-for="(value, key) in superhero.attributes"
          :key="key"
          class="attribute-input"
        >
          <label :for="key" class="attribute-label">{{ key }}</label>
          <input
            :id="key"
            v-model.number="superhero.attributes[key]"
            type="range"
            min="0"
            max="10"
            required
            class="attribute-slider"
          />
          <span class="attribute-value">{{ superhero.attributes[key] }}</span>
        </div>
      </div>
      <button type="submit" class="submit-button">
        {{ isEditing ? 'Update' : 'Create' }} 
      </button>
    </form>

    <!-- List of superheroes -->
    <div v-if="superheroes.length">
      <div v-for="hero in superheroes" :key="hero.id" class="superhero-item">
        <h3>{{ hero.name }}</h3>
        <img :src="hero.picture" alt="Superhero Image" class="hero-list-image" />
        <ul>
          <li v-for="(value, key) in hero.attributes" :key="key">
            {{ key }}: {{ value }}
          </li>
        </ul>
        <button @click="editHero(hero)" class="edit-button">Edit</button>
        <button @click="deleteHero(hero.id)" class="delete-button">Delete</button>
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

<style scoped>
.superhero-form {
  border-radius: 15px;
  padding: 30px;

  max-width: 500px;
  margin: 0 auto;
}

@font-face {
  font-family: 'brisk_regular';
  src: url('public/brisk_regular.ttf') format('woff2'), 
       url('public/brisk_regular.ttf') format('woff');
  font-weight: normal;
  font-style: normal;
}

h3{
  color: #ffffff;
  font-family: 'brisk_regular';
  font-size: 1.5em;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 30px;

}
.form-title {
  color: #FDD100;
  font-family: 'brisk_regular';
  font-size: 2.5em;
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 30px;

}

.input-group {
  margin-bottom: 20px;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  font-size: 1em;
  transition: background-color 0.3s;
}

.form-input:focus {
  background-color: #fff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.5);
}

.file-input-label {
  display: inline-block;
  padding: 10px 20px;
  background-color: #ffffff02;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.file-input-label:hover {
  background-color: #ffffff2d;
}

.file-input {
  display: none;
}

.image-preview {
  margin-bottom: 20px;
  text-align: center;
}

.preview-img {
  max-width: 100%;
  max-height: 128px;
  border-radius: 5px;
}

.attributes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.attribute-input {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.attribute-label {
  color: #fff;
  font-size: 1.2em;
  margin-bottom: 5px;
  text-transform: capitalize;
}

.attribute-slider {
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: #d3d3d3;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
}

.attribute-slider:hover {
  color: white;
  opacity: 1;
}



.attribute-value {
  color: #fff;
  font-size: 1.2em;
  margin-top: 5px;
}

.submit-button {
  width: 100%;
  padding: 15px;
  border: none;
  border-radius: 5px;
  background-color: #ffffff00;
  color: #fff;
  font-size: 1.2em;
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

.submit-button:hover {
  background-color: #ffffff5d;
}

.submit-button:active {
  transform: scale(0.98);
}

.superhero-item {
  margin-bottom: 20px;
  background-color: #ffffff00;
  color: #fff;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
}

.hero-list-image {
  width: 128px;
  height: 128px;
}

.edit-button,
.delete-button {
  padding: 10px 15px;
  margin: 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.edit-button {
  background-color: #3498db;
  color: #fff;
}

.delete-button {
  background-color: #e74d3c00;
  color: #fff;
}
</style>
