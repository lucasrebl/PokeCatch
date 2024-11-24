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

  return { points, inventory, buyItem };
});
