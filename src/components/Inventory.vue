<script setup lang="ts">
import { useInventoryStore } from "@/stores/inventory";

import pokeBallImg from "@/assets/PokéBall.png";
import superBallImg from "@/assets/SuperBall.png";
import hyperBallImg from "@/assets/HyperBall.png";
import honorBallImg from "@/assets/HonorBall.png";

const inventoryStore = useInventoryStore();
</script>

<template>
  <main>
    <h1>Inventaire</h1>
    <p>Points restants : {{ inventoryStore.points }}</p>
    <ul>
      <li>
        <img :src="pokeBallImg" alt="Poké Ball" width="50" height="50" />
        x{{ inventoryStore.inventory.pokeBall }}
      </li>
      <li>
        <img :src="superBallImg" alt="Super Ball" width="50" height="50" />
        x{{ inventoryStore.inventory.superBall }}
      </li>
      <li>
        <img :src="hyperBallImg" alt="Hyper Ball" width="50" height="50" />
        x{{ inventoryStore.inventory.hyperBall }}
      </li>
      <li>
        <img :src="honorBallImg" alt="Honor Ball" width="50" height="50" />
        x{{ inventoryStore.inventory.honorBall }}
      </li>
    </ul>
  </main>
</template>

<style scoped>
h1 {
    margin-top: 6em;
}

ul {
  list-style: none;
  padding: 0;
}

li {
  display: flex;
  align-items: center;
  margin: 10px 0;
}

img {
  margin-right: 10px;
}
</style>
