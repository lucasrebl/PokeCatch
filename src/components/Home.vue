<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Liste pour stocker les images des Pokémon
const pokemonImages = ref<string[]>([]);

// Fonction pour récupérer un certain nombre de Pokémon aléatoires et leurs images
const fetchPokemonImages = async () => {
  const pokemonCount = 10; // Nombre de Pokémon à récupérer
  const randomIds = Array.from({ length: pokemonCount }, () => Math.floor(Math.random() * 1010) + 1); // Pokémon IDs aléatoires entre 1 et 1010

  try {
    const promises = randomIds.map(id =>
      fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
        .then(response => response.json())
        .then(data => data.sprites.front_default) // Récupère l'image de chaque Pokémon
    );
    const images = await Promise.all(promises);
    pokemonImages.value = images;
  } catch (error) {
    console.error('Erreur lors de la récupération des Pokémon:', error);
  }
};

// Charger les images lors du montage du composant
onMounted(() => {
  fetchPokemonImages();
});
</script>

<template>
  <main>
    <div class="welcome-message">
      <h1>Bienvenue sur PokéCatch</h1>
      <p>
        Ce site vous permet de capturer tous les Pokémon de la 1G à la 9G.
      </p>
      <p>
        Amusez-vous à compléter votre Pokédex et à découvrir tous les Pokémon disponibles !
      </p>
    </div>

    <!-- Défilement continu des images de Pokémon -->
    <div class="pokemon-gallery">
      <div class="pokemon-images">
        <div class="pokemon-image" v-for="(img, index) in pokemonImages" :key="index">
          <img :src="img" alt="Pokémon" />
        </div>
        <!-- Répéter les images pour l'illusion du défilement continu -->
        <div class="pokemon-image" v-for="(img, index) in pokemonImages" :key="'repeat-' + index">
          <img :src="img" alt="Pokémon" />
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.welcome-message {
    text-align: center;
    padding: 20px;
    border-radius: 10px;
    max-width: 600px;
    font-family: 'Arial', sans-serif;
    margin-top: -23%;
    background-color: #e8dede;
    margin-left: 33%;
}

.welcome-message h1 {
    color: #333;
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 20px;
    letter-spacing: 2px;
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}

.welcome-message p {
    font-size: 1.2rem;
    color: #333;
    line-height: 1.6;
    margin-bottom: 10px;
    opacity: 0.8;
}

.pokemon-gallery {
    display: flex;
    justify-content: flex-start;  /* Aligner à gauche */
    overflow: hidden;
    width: 100%;
    height: 150px; /* Ajustez la hauteur pour un effet plus visible */
    margin-top: 30px;
}

.pokemon-images {
    display: flex;
    animation: scrollImages 30s linear infinite; /* Animation infinie */
}

.pokemon-image {
    width: 100px;  /* Largeur de chaque image */
    margin: 0 15px;
}

.pokemon-images img {
    width: 100%;
    height: auto;
}

/* Animation de défilement horizontal */
@keyframes scrollImages {
    0% {
        transform: translateX(100%); /* Commencer à droite */
    }
    100% {
        transform: translateX(-100%); /* Déplacer à gauche */
    }
}
</style>
