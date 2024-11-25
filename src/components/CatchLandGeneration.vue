<script setup lang="ts">
import { ref } from 'vue';
import { useInventoryStore } from '@/stores/inventory'; // Assurez-vous du bon chemin du store

// Initialisation du store
const inventoryStore = useInventoryStore();

// Listes des générations et habitats
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

const habitatList = ref([
    { label: 'Cave', value: 'cave' },
    { label: 'Forest', value: 'forest' },
    { label: 'Grassland', value: 'grassland' },
    { label: 'Mountain', value: 'mountain' },
    { label: 'Rare', value: 'rare' },
    { label: 'Rough Terrain', value: 'rough-terrain' },
    { label: 'Sea', value: 'sea' },
    { label: 'Urban', value: 'urban' },
    { label: "Water's Edge", value: 'waters-edge' },
]);

// Sélections de l'utilisateur
const selectedGeneration = ref(1);
const selectedHabitat = ref('cave');

// Pokémon aléatoire affiché
const randomPokemon = ref<{ name: string, id: number, image: string, captureRate: number, captureMessage?: string } | string | null>(null);

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

        const [start, end] = generationRange[selectedGeneration.value];
        const allPokemons: any[] = [];

        // Récupérer tous les Pokémon de la génération sélectionnée
        for (let id = start; id <= end; id++) {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const data = await response.json();

            // Récupérer les informations de l'habitat
            const speciesResponse = await fetch(data.species.url);
            const speciesData = await speciesResponse.json();

            // Si l'habitat correspond, ajouter à la liste des Pokémon filtrés
            const normalizedHabitat = speciesData.habitat?.name.toLowerCase().replace("'", '') || '';
            const normalizedSelectedHabitat = selectedHabitat.value.toLowerCase().replace("'", '');

            if (normalizedHabitat === normalizedSelectedHabitat) {
                allPokemons.push({
                    name: data.name,
                    id: data.id,
                    image: data.sprites.front_default,
                    captureRate: speciesData.capture_rate, // Taux de capture du Pokémon
                });
            }
        }

        // Si aucun Pokémon ne correspond, afficher un message
        if (allPokemons.length === 0) {
            randomPokemon.value = `Aucun Pokémon trouvé pour cet habitat dans cette génération.`;
            return;
        }

        // Choisir un Pokémon aléatoire parmi ceux filtrés
        const randomIndex = Math.floor(Math.random() * allPokemons.length);
        randomPokemon.value = allPokemons[randomIndex];

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
        <h1>Filtrer les Pokémon</h1>

        <div class="form-group">
            <label for="generation">Choisissez une génération :</label>
            <select id="generation" v-model="selectedGeneration">
                <option v-for="generation in generationList" :key="generation.value" :value="generation.value">
                    {{ generation.label }}
                </option>
            </select>
        </div>

        <div class="form-group">
            <label for="habitat">Choisissez un habitat :</label>
            <select id="habitat" v-model="selectedHabitat">
                <option v-for="habitat in habitatList" :key="habitat.value" :value="habitat.value">
                    {{ habitat.label }}
                </option>
            </select>
        </div>

        <button @click="fetchRandomPokemon">Afficher un Pokémon aléatoire</button>

        <div v-if="randomPokemon" class="result">
            <p v-if="typeof randomPokemon === 'object'">
                <strong>{{ randomPokemon.name }}</strong> (ID: {{ randomPokemon.id }})<br />
                Capture Rate: {{ randomPokemon.captureRate }}%
            </p>
            <img v-if="typeof randomPokemon === 'object'" :src="randomPokemon.image" :alt="randomPokemon.name" />
            <p v-if="typeof randomPokemon === 'string'">{{ randomPokemon }}</p>

            <!-- Affichage du message de capture -->
            <p v-if="randomPokemon && typeof randomPokemon !== 'string' && randomPokemon.captureMessage">
                {{ randomPokemon.captureMessage }}
            </p>

            <!-- Boutons pour capturer le Pokémon -->
            <div v-if="typeof randomPokemon === 'object'">
                <button @click="capturePokemon('pokeBall')">Utiliser PokéBall</button>
                <button @click="capturePokemon('superBall')">Utiliser SuperBall</button>
                <button @click="capturePokemon('hyperBall')">Utiliser HyperBall</button>
                <button @click="capturePokemon('honorBall')">Utiliser HonorBall</button>
            </div>
        </div>
    </main>
</template>

<style scoped>
h1 {
    text-align: center;
    margin-top: -30%;
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

button {
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

button:hover {
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
