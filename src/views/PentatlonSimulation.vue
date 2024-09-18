<template>
  <div class="max-w-7xl mx-auto p-6 space-y-8 transition-colors duration-300 dark:bg-gray-800">
    <h1 class="text-4xl font-bold text-center text-indigo-600 dark:text-yellow-400">Pentathlon Simulation</h1>

    <div v-if="selectedHeroes.length < 3" class="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 space-y-4">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white">Select 3 Superheroes:</h2>

      <div v-for="(hero, index) in 3" :key="index" class="space-y-2">
        <label :for="'hero-dropdown-' + index" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Select Hero {{ index + 1 }}:
        </label>
        <div class="relative">
          <button 
            :id="'hero-dropdown-' + index"
            @click="toggleDropdown(index)"
            class="w-full text-left px-4 py-2 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-white"
          >
            {{ selectedHeroIds[index] ? heroes.find(h => h.id === selectedHeroIds[index])?.name : 'Select a superhero' }}
          </button>
          <div v-if="openDropdown === index" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-600 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
            <div
              v-for="hero in availableHeroes"
              :key="hero.id"
              @click="selectHero(index, hero.id)"
              class="cursor-pointer select-none relative py-2 pl-3 pr-9 text-gray-900 dark:text-white hover:bg-indigo-600 hover:text-white"
            >
              {{ hero.name }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="space-y-6">
      <div class="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Selected Superheroes:</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="(hero, index) in selectedHeroes" :key="hero.id" class="bg-gray-100 dark:bg-gray-600 rounded-lg overflow-hidden shadow-lg transition transform hover:-translate-y-1 hover:shadow-xl">
            <img :src="hero.picture" :alt="hero.name" class="w-32 h-32 object-cover rounded-full mx-auto mt-4">
            <div class="p-4">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white text-center mb-2">{{ hero.name }}</h3>
              <div class="space-y-2">
                <div v-for="(value, key) in hero.attributes" :key="key" class="flex items-center">
                  <span class="font-bold mr-2 text-gray-700 dark:text-gray-300 w-24">{{ key }}:</span>
                  <div class="flex-grow h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500" :style="{ width: (value / 10) * 100 + '%' }"></div>
                  </div>
                  <span class="ml-2 text-gray-700 dark:text-gray-300">{{ value }}</span>
                </div>
              </div>
              <span class="mt-2 inline-block px-2 py-1 bg-indigo-500 text-white text-xs rounded-full">Number: {{ index + 1 }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <button @click="runSimulation" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105">
        Run Simulation
      </button>
    </div>

    <div v-if="eventResults.length" class="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6 mt-6">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Event Results:</h2>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hero</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Skyscraper Climbing</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Telling a Joke</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Villain Shooting</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">200km Sprint</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rescuing Kittens</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200 dark:bg-gray-700 dark:divide-gray-600">
            <tr v-for="result in eventResults" :key="result.hero.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                {{ result.hero.name }}
              </td>
              <td v-for="(score, index) in result.scores" :key="index" class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {{ score.points }} points ({{ score.place }} place)
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="results.length" class="bg-white dark:bg-gray-700 rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Final Ranking:</h2>
        <ol class="space-y-2">
          <li v-for="(result, index) in results" :key="result.hero.id" 
              :class="[
                'flex items-center p-3 rounded-lg transition-all duration-300 hover:shadow-md',
                index === 0 ? 'bg-yellow-100 dark:bg-yellow-900' :
                index === 1 ? 'bg-gray-200 dark:bg-gray-700' :
                index === 2 ? 'bg-orange-100 dark:bg-orange-900' :
                'bg-gray-100 dark:bg-gray-600'
              ]"
          >
            <span :class="[
              'flex items-center justify-center w-8 h-8 rounded-full mr-4 text-xl',
              index === 0 ? 'bg-yellow-500' :
              index === 1 ? 'bg-gray-400' :
              index === 2 ? 'bg-orange-500' :
              'bg-indigo-500 text-white'
            ]">
              {{ index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1 }}
            </span>
            <span class="font-medium text-gray-800 dark:text-white">{{ result.hero.name }}</span>
            <span class="ml-auto font-semibold text-indigo-600 dark:text-indigo-400">Points: {{ result.points }}</span>
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
    const openDropdown = ref<number | null>(null);

    const availableHeroes = computed(() => {
      return heroes.value.filter(h => !selectedHeroIds.value.includes(h.id));
    });

    const toggleDropdown = (index: number) => {
      openDropdown.value = openDropdown.value === index ? null : index;
    };

    const selectHero = (index: number, heroId: number) => {
      selectedHeroIds.value[index] = heroId;
      updateSelectedHero(index);
      openDropdown.value = null;
    };

    const updateSelectedHero = (index: number) => {
      const selectedId = selectedHeroIds.value[index];
      const hero = heroes.value.find(h => h.id === selectedId);
      if (hero) {
        selectedHeroes.value[index] = hero;
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
      results.value.sort((a, b) => b.points - a.results);
    };

    onMounted(() => {
      getHeroes().then(fetchedHeroes => {
        heroes.value = fetchedHeroes;
      });
    });

    return {
      heroes,
      availableHeroes,
      selectedHeroIds,
      selectedHeroes,
      results,
      eventResults,
      openDropdown,
      toggleDropdown,
      selectHero,
      updateSelectedHero,
      runSimulation,
    };
  }
});
</script>