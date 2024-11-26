<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

interface CapturedPokemon {
    id: number;
    name: string;
    image: string;
    generation: number;
    captureCount: number; // Ajouter un champ pour le nombre de captures
}

// Liste des générations, y compris une option "Toutes"
const generationList = ref([
    { label: 'Toutes', range: [1, Infinity] },
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

const selectedGeneration = ref(0); // Par défaut, "Toutes"

// Liste des Pokémon capturés
const capturedPokemonList = ref<CapturedPokemon[]>([]);
const filteredPokemonList = ref<CapturedPokemon[]>([]);

// Charger les Pokémon depuis le localStorage
const loadCapturedPokemons = () => {
    const storedData = localStorage.getItem('capturedPokemons');
    if (storedData) {
        const storedPokemons = JSON.parse(storedData);

        // Utiliser un objet pour accumuler le nombre de captures par Pokémon
        const pokemonMap: Record<number, CapturedPokemon> = {};

        // Ajouter les Pokémon au map en incrémentant leur compteur de capture
        storedPokemons.forEach((pokemon: CapturedPokemon) => {
            if (pokemonMap[pokemon.id]) {
                pokemonMap[pokemon.id].captureCount += 1;
            } else {
                pokemonMap[pokemon.id] = { ...pokemon, captureCount: 1 };
            }
        });

        // Convertir le map en liste et trier par ID
        capturedPokemonList.value = Object.values(pokemonMap).sort((a, b) => a.id - b.id);
    } else {
        capturedPokemonList.value = [];
    }
};

// Filtrer les Pokémon en fonction de la génération sélectionnée
const filterPokemonByGeneration = () => {
    const { range } = generationList.value[selectedGeneration.value];
    filteredPokemonList.value = capturedPokemonList.value.filter(
        (pokemon) => pokemon.id >= range[0] && pokemon.id <= range[1]
    );

    // Trier la liste filtrée par ordre croissant d'ID
    filteredPokemonList.value.sort((a, b) => a.id - b.id);
};

// Charger les données au montage
onMounted(() => {
    loadCapturedPokemons();
    filterPokemonByGeneration();
});

// Recalculer la liste filtrée lorsqu'une génération est sélectionnée
watch([selectedGeneration, capturedPokemonList], filterPokemonByGeneration);
</script>

<template>
    <main>
        <h1>Mon Pokédex</h1>

        <div>
            <select id="generation-select" v-model="selectedGeneration">
                <option v-for="(generation, index) in generationList" :key="index" :value="index">
                    {{ generation.label }}
                </option>
            </select>
        </div>

        <div v-if="filteredPokemonList.length === 0" class="loading">
            Aucun Pokémon capturé pour cette génération.
        </div>
        <div v-else class="pokemon-grid">
            <div v-for="pokemon in filteredPokemonList" :key="pokemon.id" class="pokemon-info">
                <h2>{{ pokemon.name }}</h2>
                <p>ID: {{ pokemon.id }}</p>
                <img :src="pokemon.image" :alt="pokemon.name" />
                <p>Capturé {{ pokemon.captureCount }} fois</p>
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
    width: 250px;
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
</style>
