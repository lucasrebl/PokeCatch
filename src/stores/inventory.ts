import { defineStore } from "pinia";
import { ref, watch } from "vue";

const loadInventory = () => {
  const savedInventory = localStorage.getItem("inventory");
  return savedInventory ? JSON.parse(savedInventory) : {
    pokeBall: 10,
    superBall: 0,
    hyperBall: 0,
    honorBall: 0,
  };
};

const saveInventory = (inventory: Record<string, number>) => {
  localStorage.setItem("inventory", JSON.stringify(inventory));
};

export const useInventoryStore = defineStore("inventory", () => {
  const points = ref(Number(localStorage.getItem("points")) || 100);
  const inventory = ref(loadInventory());

  watch(inventory, (newInventory) => {
    saveInventory(newInventory);
  }, { deep: true });

  watch(points, (newPoints) => {
    localStorage.setItem("points", newPoints.toString());
  });

  const buyItem = (cost: number, item: keyof typeof inventory.value) => {
    if (points.value >= cost) {
      points.value -= cost;
      inventory.value[item]++;
      return true;
    }
    return false;
  };

  const capturePokemon = (pokemon: { name: string, id: number, captureRate: number }, ballType: string) => {
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

    const success = Math.random() * 100 < captureChance;
    if (success) {
      // Ajouter le Pokémon au localStorage si capturé
      let capturedPokemons = JSON.parse(localStorage.getItem("capturedPokemons") || "[]");
      capturedPokemons.push({ name: pokemon.name, id: pokemon.id });
      localStorage.setItem("capturedPokemons", JSON.stringify(capturedPokemons));

      return { success: true, message: "Le Pokémon a été capturé !" };
    } else {
      return { success: false, message: "La capture a échoué. Essayez encore." };
    }
  };

  return { points, inventory, buyItem, capturePokemon };
});
