<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Pokemon {
  id: number;
  name: string;
  sprites: { front_default: string };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { stat: { name: string }; base_stat: number }[];
  habitat: string;
  capture_rate: number;
  region: string;
}

// Liste des générations et des intervalles correspondants
const generationList = ref([
  { label: '1G', range: [1, 151] },
  { label: '2G', range: [152, 251] },
  { label: '3G', range: [252, 386] },
  { label: '4G', range: [387, 493] },
  { label: '5G', range: [494, 649] },
  { label: '6G', range: [650, 721] },
  { label: '7G', range: [722, 809] },
  { label: '8G', range: [810, 905] },
  { label: '9G', range: [906, 1025] },
]);

const selectedGeneration = ref(1);
const pokemonList = ref<Pokemon[]>([]);

const fetchPokemonData = async (generation: number) => {
  try {
    const { range } = generationList.value[generation - 1]; // Récupérer l'intervalle de la génération sélectionnée
    const offset = range[0] - 1; // L'offset commence à 0, donc on soustrait 1
    const limit = range[1] - offset; // Le nombre de Pokémon à récupérer

    const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
    const data = await response.json();

    const promises = data.results.map(async (pokemon: { url: string }) => {
      const pokemonResponse = await fetch(pokemon.url);
      const pokemonDetails = await pokemonResponse.json();

      const speciesResponse = await fetch(pokemonDetails.species.url);
      const speciesDetails = await speciesResponse.json();

      const regionResponse = await fetch(speciesDetails.generation.url);
      const regionDetails = await regionResponse.json();

      return {
        ...pokemonDetails,
        habitat: speciesDetails.habitat ? speciesDetails.habitat.name : 'Unknown',
        capture_rate: speciesDetails.capture_rate,
        region: regionDetails.main_region.name,
      };
    });

    const pokemonData = await Promise.all(promises);
    pokemonData.sort((a, b) => a.id - b.id); // Trier par ID (ordre croissant)
    pokemonList.value = pokemonData;
  } catch (error) {
    console.error('Erreur lors de la récupération des Pokémon:', error);
  }
};

onMounted(() => {
  fetchPokemonData(selectedGeneration.value); // Chargement initial avec la génération par défaut
});

const handleGenerationChange = () => {
  fetchPokemonData(selectedGeneration.value);
};
</script>

<template>
  <main>
    <h1>Liste des Pokémon de la {{ generationList[selectedGeneration - 1].label }}</h1>
    
    <select v-model="selectedGeneration" @change="handleGenerationChange">
      <option v-for="(generation, index) in generationList" :key="index" :value="index + 1">
        {{ generation.label }}
      </option>
    </select>

    <div v-if="pokemonList.length === 0" class="loading">Chargement...</div>
    <div v-else class="pokemon-grid">
      <div v-for="pokemon in pokemonList" :key="pokemon.id" class="pokemon-info">
        <h2>{{ pokemon.name }}</h2>
        <p>ID: {{ pokemon.id }}</p>
        <img :src="pokemon.sprites.front_default" :alt="pokemon.name" />
        <p>Types: {{ pokemon.types.map(type => type.type.name).join(', ') }}</p>
        <p>Capacités: {{ pokemon.abilities.map(ability => ability.ability.name).join(', ') }}</p>
        <p>Stats:</p>
        <ul>
          <li v-for="stat in pokemon.stats" :key="stat.stat.name">
            {{ stat.stat.name }}: {{ stat.base_stat }}
          </li>
        </ul>
        <p>Habitat: {{ pokemon.habitat }}</p>
        <p>Taux de capture: {{ pokemon.capture_rate }}</p>
        <p>Région: {{ pokemon.region }}</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
  color: #fff;
  margin: 30px;
}

.loading {
  text-align: center;
  font-size: 1.5rem;
  color: #666;
}

select {
  display: block;
  margin: 20px auto;
  padding: 8px 15px;
  font-size: 1rem;
}

.pokemon-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.pokemon-info {
  background: #e8dede;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  width: 270px;
}

.pokemon-info img {
  max-width: 100px;
}

.pokemon-info h2 {
  font-size: 1.2rem;
  color: #333;
}

.pokemon-info p {
  margin: 5px 0;
  font-size: 0.9rem;
  color: #333;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
  color: #333;
}
</style>
