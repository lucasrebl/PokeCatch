<script setup lang="ts">
import { useInventoryStore } from "@/stores/inventory";

import pokeBallImg from "@/assets/PokéBall.png";
import superBallImg from "@/assets/SuperBall.png";
import hyperBallImg from "@/assets/HyperBall.png";

const inventoryStore = useInventoryStore();

const pokeBallCost = 10;
const superBallCost = 20;
const hyperBallCost = 50;

const buyItem = (cost: number, item: keyof typeof inventoryStore.inventory) => {
  if (inventoryStore.buyItem(cost, item)) {
    alert(`Achat réussi ! Il vous reste ${inventoryStore.points} points.`);
  } else {
    alert("Vous n'avez pas assez de points pour cet achat !");
  }
};
</script>

<template>
  <div>
    <div class="items-container">
      <button :disabled="inventoryStore.points < pokeBallCost" @click="buyItem(pokeBallCost, 'pokeBall')">
        <img :src="pokeBallImg" alt="Poké Ball" />
        <p>Poké Ball ({{ pokeBallCost }} points)</p>
      </button>

      <button :disabled="inventoryStore.points < superBallCost" @click="buyItem(superBallCost, 'superBall')">
        <img :src="superBallImg" alt="Super Ball" />
        <p>Super Ball ({{ superBallCost }} points)</p>
      </button>

      <button :disabled="inventoryStore.points < hyperBallCost" @click="buyItem(hyperBallCost, 'hyperBall')">
        <img :src="hyperBallImg" alt="Hyper Ball" />
        <p>Hyper Ball ({{ hyperBallCost }} points)</p>
      </button>
    </div>
  </div>
</template>

<style scoped>
.items-container {
  display: flex;
  justify-content: center;
  margin-top: -25%;
  gap: 20px;
}

button {
  display: flex;
  flex-direction: column;
  align-items: center;
  border: none;
  background: none;
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
}

img {
  width: 100px;
  height: 100px;
  object-fit: contain;
  margin-bottom: 10px;
}

p {
  margin: 0;
  font-size: 14px;
  color: #aaa;
}

button:disabled img {
  opacity: 0.5;
}

button:disabled p {
  color: #333;
}
</style>
