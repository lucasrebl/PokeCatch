import { defineStore } from "pinia";
import { ref, watch } from "vue";

// Chargement des données du localStorage ou initialisation par défaut
const loadInventory = () => {
  const savedInventory = localStorage.getItem("inventory");
  return savedInventory
    ? JSON.parse(savedInventory)
    : {
        pokeBall: 10,
        superBall: 0,
        hyperBall: 0,
        honorBall: 0,
      };
};

// Fonction pour sauvegarder l'inventaire dans le localStorage
const saveInventory = (inventory: Record<string, number>) => {
  localStorage.setItem("inventory", JSON.stringify(inventory));
};

export const useInventoryStore = defineStore("inventory", () => {
  // Chargement des points depuis le localStorage ou initialisation
  const points = ref(Number(localStorage.getItem("points")) || 150);
  const inventory = ref(loadInventory());

  // Enregistrement immédiat des données si elles ne sont pas dans le localStorage
  localStorage.setItem("points", points.value.toString());
  saveInventory(inventory.value);

  // Synchronisation avec le localStorage en cas de changement
  watch(
    inventory,
    (newInventory) => {
      saveInventory(newInventory);
    },
    { deep: true, immediate: true }
  );

  watch(
    points,
    (newPoints) => {
      localStorage.setItem("points", newPoints.toString());
    },
    { immediate: true }
  );

  const buyItem = (cost: number, item: keyof typeof inventory.value) => {
    if (points.value >= cost) {
      points.value -= cost;
      inventory.value[item]++;
      return true;
    }
    return false;
  };

  const capturePokemon = (
    pokemon: { name: string; id: number; captureRate: number; image: string },
    ballType: string
  ) => {
    const ballMultipliers: Record<string, number> = {
      pokeBall: 1.5,
      superBall: 2.0,
      hyperBall: 2.5,
      honorBall: 1.5,
    };

    const multiplier = ballMultipliers[ballType];
    if (!multiplier || inventory.value[ballType] <= 0) {
      return { success: false, message: "Vous n'avez pas assez de cette ball." };
    }

    inventory.value[ballType]--; // Décrémenter l'inventaire de la ball utilisée
    const captureChance = (pokemon.captureRate * multiplier) / 255 * 100;

    console.log(`Capture Chance for ${pokemon.name}: ${captureChance}%`);

    const success = Math.random() * 100 < captureChance;
    if (success) {
      let capturedPokemons = JSON.parse(localStorage.getItem("capturedPokemons") || "[]");
      capturedPokemons.push({
        name: pokemon.name,
        id: pokemon.id,
        image: pokemon.image, // Enregistrement de l'image
      });
      localStorage.setItem("capturedPokemons", JSON.stringify(capturedPokemons));

      let pointsToAdd = 0;
      if (captureChance <= 20) pointsToAdd = 500;
      else if (captureChance <= 40) pointsToAdd = 400;
      else if (captureChance <= 60) pointsToAdd = 300;
      else if (captureChance <= 80) pointsToAdd = 150;
      else if (captureChance <= 90) pointsToAdd = 100;
      else pointsToAdd = 50;

      points.value += pointsToAdd;

      return { success: true, message: "Le Pokémon a été capturé !" };
    } else {
      return { success: false, message: "La capture a échoué. Essayez encore." };
    }
  };

  return { points, inventory, buyItem, capturePokemon };
});
