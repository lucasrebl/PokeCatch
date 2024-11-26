<script setup lang="ts">
import { ref } from 'vue';
import { useInventoryStore } from '@/stores/inventory'; // Assurez-vous du bon chemin du store

import pokeBallImg from "@/assets/PokéBall.png";
import superBallImg from "@/assets/SuperBall.png";
import hyperBallImg from "@/assets/HyperBall.png";
import honorBallImg from "@/assets/HonorBall.png";

// Initialisation du store
const inventoryStore = useInventoryStore();

// Listes des générations et types
const generationList = ref([
    { label: '1G', value: 1 },
    { label: '2G', value: 2 },
    { label: '3G', value: 3 },
    { label: '4G', value: 4 },
    { label: '5G', value: 5 },
    { label: '6G', value: 6 },
    { label: '7G', value: 7 },
    { label: '8G', value: 8 },
    { label: '9G', value: 9 },
]);

const typeList = ref([
    { label: 'Normal', value: 'normal' },
    { label: 'Fire', value: 'fire' },
    { label: 'Water', value: 'water' },
    { label: 'Grass', value: 'grass' },
    { label: 'Electric', value: 'electric' },
    { label: 'Ice', value: 'ice' },
    { label: 'Fighting', value: 'fighting' },
    { label: 'Poison', value: 'poison' },
    { label: 'Ground', value: 'ground' },
    { label: 'Flying', value: 'flying' },
    { label: 'Psychic', value: 'psychic' },
    { label: 'Bug', value: 'bug' },
    { label: 'Rock', value: 'rock' },
    { label: 'Ghost', value: 'ghost' },
    { label: 'Dark', value: 'dark' },
    { label: 'Dragon', value: 'dragon' },
    { label: 'Steel', value: 'steel' },
    { label: 'Fairy', value: 'fairy' },
]);

// Sélections de l'utilisateur
const selectedGeneration = ref(1);
const selectedType = ref('normal');

// Pokémon aléatoire affiché
const randomPokemon = ref<
    { name: string; id: number; image: string; captureRate: number; captureMessage?: string } | string | null
>(null);

// Fonction pour afficher un Pokémon aléatoire
const fetchRandomPokemon = async () => {
    try {
        const generationRange: Record<number, number[]> = {
            1: [1, 151],
            2: [152, 251],
            3: [252, 386],
            4: [387, 493],
            5: [494, 649],
            6: [650, 721],
            7: [722, 809],
            8: [810, 905],
            9: [906, 1025],
        };

        if (!generationRange[selectedGeneration.value]) {
            console.error('Erreur : génération invalide.', selectedGeneration.value);
            randomPokemon.value = 'Erreur : génération invalide.';
            return;
        }

        // Obtenir les Pokémon du type sélectionné
        const typeResponse = await fetch(`https://pokeapi.co/api/v2/type/${selectedType.value}`);
        const typeData = await typeResponse.json();
        const pokemonsOfType = typeData.pokemon.map((p: any) => {
            const id = parseInt(p.pokemon.url.split('/').slice(-2)[0], 10);
            return { name: p.pokemon.name, id };
        });

        // Filtrer les Pokémon par génération
        const [start, end] = generationRange[selectedGeneration.value];
        const filteredPokemons = pokemonsOfType.filter((p: { id: number }) => p.id >= start && p.id <= end);

        if (filteredPokemons.length === 0) {
            randomPokemon.value = `Aucun Pokémon trouvé pour ce type dans cette génération.`;
            return;
        }

        // Choisir un Pokémon aléatoire
        const randomIndex = Math.floor(Math.random() * filteredPokemons.length);
        const randomPokemonData = filteredPokemons[randomIndex];

        // Récupérer les informations détaillées du Pokémon
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomPokemonData.id}`);
        const data = await response.json();

        // Récupérer le taux de capture depuis l'endpoint species
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${randomPokemonData.id}`);
        const speciesData = await speciesResponse.json();

        randomPokemon.value = {
            name: data.name,
            id: data.id,
            image: data.sprites.front_default,
            captureRate: speciesData.capture_rate, // Taux de capture
        };
    } catch (error) {
        randomPokemon.value = 'Erreur lors de la récupération des données.';
        console.error('Erreur attrapée :', error);
    }
};

// Fonction de capture de Pokémon
const capturePokemon = (ballType: string) => {
    if (!randomPokemon.value || typeof randomPokemon.value === 'string') return;

    // Appel à la méthode capturePokemon du store
    const result = inventoryStore.capturePokemon(randomPokemon.value, ballType);

    // Mettre à jour le message de capture
    randomPokemon.value.captureMessage = result.message;
};
</script>

<template>
    <main>
        <h1>Capturer des Pokémon</h1>

        <div class="form-group">
            <label for="generation">Choisissez une génération :</label>
            <select id="generation" v-model="selectedGeneration">
                <option v-for="generation in generationList" :key="generation.value" :value="generation.value">
                    {{ generation.label }}
                </option>
            </select>
        </div>

        <div class="form-group">
            <label for="type">Choisissez un type :</label>
            <select id="type" v-model="selectedType">
                <option v-for="type in typeList" :key="type.value" :value="type.value">
                    {{ type.label }}
                </option>
            </select>
        </div>

        <button class="button" @click="fetchRandomPokemon">Rencontrer un Pokémon aléatoire</button>

        <div v-if="randomPokemon" class="result">
            <p v-if="typeof randomPokemon === 'object'">
                <strong>{{ randomPokemon.name }}</strong> (ID: {{ randomPokemon.id }})<br />
            </p>
            <img v-if="typeof randomPokemon === 'object'" :src="randomPokemon.image" :alt="randomPokemon.name" />
            <p v-if="typeof randomPokemon === 'string'">{{ randomPokemon }}</p>

            <p v-if="randomPokemon && typeof randomPokemon !== 'string' && randomPokemon.captureMessage">
                {{ randomPokemon.captureMessage }}
            </p>

            <div v-if="typeof randomPokemon === 'object'">
                <button :disabled="inventoryStore.inventory.pokeBall <= 0" @click="capturePokemon('pokeBall')" class="ball-button">
                    <img :src="pokeBallImg" alt="Poké Ball" />
                </button>
                <button :disabled="inventoryStore.inventory.superBall <= 0" @click="capturePokemon('superBall')" class="ball-button">
                    <img :src="superBallImg" alt="Super Ball" />
                </button>
                <button :disabled="inventoryStore.inventory.hyperBall <= 0" @click="capturePokemon('hyperBall')" class="ball-button">
                    <img :src="hyperBallImg" alt="Hyper Ball" />
                </button>
                <button :disabled="inventoryStore.inventory.honorBall <= 0" @click="capturePokemon('honorBall')" class="ball-button">
                    <img :src="honorBallImg" alt="Honor Ball" />
                </button>
            </div>
        </div>
    </main>
</template>

<style scoped>
h1 {
    text-align: center;
    margin-top: -25%;
}

.form-group {
    margin: 10px 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

label {
    margin-bottom: 5px;
    font-weight: bold;
}

select {
    padding: 8px;
    font-size: 1rem;
    border-radius: 4px;
    border: 1px solid #ccc;
    margin-left: 10px;
}

.button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    font-size: 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}

.ball-button {
    margin: 20px auto;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    background: none;
    transition: transform 0.3s ease;
}

.ball-button img {
    max-width: 200px;
    height: 70px;
}

.ball-button:hover {
    transform: scale(1.5);
}

.ball-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

.button:hover {
    background-color: #45a049;
}

.result {
    text-align: center;
    margin-top: 20px;
    font-size: 1.2rem;
    color: #333;
}

img {
    margin-top: 10px;
    max-width: 200px;
    height: auto;
}
</style>
