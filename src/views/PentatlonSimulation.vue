<template>
  <div>
    <h1>Pentathlon Simulation</h1>

    <div v-if="selectedHeroes.length < 3">
      <h2>Select 3 Superheroes:</h2>

      <!-- Dropdowns for selecting heroes -->
      <div v-for="(hero, index) in 3" :key="index" class="hero-dropdown">
        <label :for="'hero-dropdown-' + index">Select Hero {{ index + 1 }}:</label>
        <select :id="'hero-dropdown-' + index" v-model="selectedHeroIds[index]" @change="updateSelectedHero(index)">
          <option disabled value="">Select a superhero</option>
          <option v-for="hero in availableHeroes" :key="hero.id" :value="hero.id">
            {{ hero.name }}
          </option>
        </select>
      </div>
    </div>

    <div v-else>
      <h2>Selected Superheroes:</h2>
      <ul>
        <li v-for="(hero, index) in selectedHeroes" :key="hero.id">
          {{ hero.name }} - {{ hero.attributes.strength }} strength, {{ hero.attributes.agility }} agility, 
          {{ hero.attributes.charisma }} charisma
          <img :src="hero.picture" alt="Superhero Image" class="selected-hero-image" />
          <span>Number: {{ index + 1 }}</span>
        </li>
      </ul>
      <button @click="runSimulation">Run Simulation</button>
    </div>

    <div v-if="eventResults.length">
      <h2>Event Results:</h2>

      <!-- Event results grid -->
      <table class="results-grid">
        <thead>
          <tr>
            <th>Hero</th>
            <th>Skyscraper Climbing</th>
            <th>Telling a Joke</th>
            <th>Villain Shooting</th>
            <th>200km Sprint</th>
            <th>Rescuing 100 Kittens</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="result in eventResults" :key="result.hero.id">
            <td>{{ result.hero.name }}</td>
            <td>{{ result.scores[0].points }} ({{ result.scores[0].place }} place)</td>
            <td>{{ result.scores[1].points }} ({{ result.scores[1].place }} place)</td>
            <td>{{ result.scores[2].points }} ({{ result.scores[2].place }} place)</td>
            <td>{{ result.scores[3].points }} ({{ result.scores[3].place }} place)</td>
            <td>{{ result.scores[4].points }} ({{ result.scores[4].place }} place)</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="results.length">
      <h2>Final Ranking:</h2>
      <ol>
        <li v-for="result in results" :key="result.hero.id">
          {{ result.hero.name }} - Points: {{ result.points }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { Superhero } from '../types/superhero';
import { getHeroes } from '../services/api';

export default defineComponent({
  name: 'PentathlonSimulation',
  setup() {
    const heroes = ref<Superhero[]>([]);
    const selectedHeroIds = ref<Array<number | null>>([null, null, null]);
    const selectedHeroes = ref<Superhero[]>([]);
    const results = ref<Array<{ hero: Superhero, points: number }>>([]);
    const eventResults = ref<Array<{ hero: Superhero, scores: Array<{ points: number, place: number }> }>>([]);

    const availableHeroes = computed(() => {
      return heroes.value.filter(h => !selectedHeroIds.value.includes(h.id));
    });

    const updateSelectedHero = (index: number) => {
      const selectedId = selectedHeroIds.value[index];
      const hero = heroes.value.find(h => h.id === selectedId);
      if (hero) {
        selectedHeroes.value.splice(index, 1, hero);
      }
    };

    const runSimulation = () => {
      // Reset the results
      results.value = [];
      eventResults.value = [];

      // Event calculation functions
      const calculateSkyscraperClimbing = (hero) => (hero.attributes.strength * 4) - (hero.attributes.weight * 2);
      const calculateTellingAJoke = (hero, opponents) => {
        const opponentCharismaSum = opponents.reduce((sum, opp) => sum + opp.attributes.charisma, 0);
        return (hero.attributes.charisma ** 2) - opponentCharismaSum;
      };
      const calculateVillainShooting = (hero, isLast) => (hero.attributes.agility + hero.attributes.strength) + (isLast ? 5 : 0);
      const calculate200kmSprint = (hero, isFirstPreviousEvent) =>
        (hero.attributes.agility * 4) + (hero.attributes.endurance * 2) + (isFirstPreviousEvent ? 10 : -1);
      const calculateRescuingKittens = (hero, wonAtLeastTwoEvents) =>
        (hero.attributes.agility * 2) + (wonAtLeastTwoEvents ? 5 : 0);

      // Function to rank each event
      const rankHeroesInEvent = (scores) => {
        const sortedScores = [...scores].sort((a, b) => b.points - a.points);
        sortedScores.forEach((score, index) => {
          score.place = index + 1; // First = 1, Second = 2, Third = 3
        });
      };

      // Event results for each hero
      const eventScores = selectedHeroes.value.map(hero => ({
        hero,
        scores: [
          { points: calculateSkyscraperClimbing(hero), place: 0 },
          { points: 0, place: 0 }, // Telling a Joke (points calculated later with opponents)
          { points: calculateVillainShooting(hero, false), place: 0 },
          { points: calculate200kmSprint(hero, false), place: 0 },
          { points: calculateRescuingKittens(hero, false), place: 0 },
        ]
      }));

      // Calculate "Telling a Joke" for each hero
      eventScores.forEach(heroResult => {
        const otherHeroes = selectedHeroes.value.filter(h => h !== heroResult.hero);
        heroResult.scores[1].points = calculateTellingAJoke(heroResult.hero, otherHeroes);
      });

      // Rank each event
      for (let i = 0; i < 5; i++) {
        const scoresForEvent = eventScores.map(heroResult => heroResult.scores[i]);
        rankHeroesInEvent(scoresForEvent);
      }

      // Save the event results
      eventResults.value = eventScores;

      // Calculate total points for final ranking
      eventScores.forEach(heroResult => {
        const totalPoints = heroResult.scores.reduce((sum, score) => sum + score.points, 0);
        results.value.push({
          hero: heroResult.hero,
          points: totalPoints
        });
      });

      // Sort final results based on total points
      results.value.sort((a, b) => b.points - a.points);
    };

    onMounted(() => {
      getHeroes().then(fetchedHeroes => {
        heroes.value = fetchedHeroes;
      });
    });

    return {
      availableHeroes,
      selectedHeroIds,
      selectedHeroes,
      results,
      eventResults,
      updateSelectedHero,
      runSimulation,
    };
  }
});
</script>

<style scoped>
.selected-hero-image {
  width: 100px;
  height: 100px;
  border-radius: 5px;
}
.hero-dropdown {
  margin-bottom: 15px;
}
.results-grid {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}
.results-grid th, .results-grid td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
.results-grid th {
  background-color: #f2f2f2;
}
div {
  color: white; /* Font color set to white */
}
</style>
