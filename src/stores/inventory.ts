import { defineStore } from "pinia";
import { ref } from "vue";

export const useInventoryStore = defineStore("inventory", () => {
  const points = ref(100);

  const inventory = ref({
    pokeBall: 10,
    superBall: 0,
    hyperBall: 0,
  });

  const buyItem = (cost: number, item: keyof typeof inventory.value) => {
    if (points.value >= cost) {
      points.value -= cost;
      inventory.value[item]++;
      return true;
    }
    return false;
  };

  return { points, inventory, buyItem };
});
