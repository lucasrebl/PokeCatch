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

const buyItemBulk = (quantity: number, cost: number, item: keyof typeof inventoryStore.inventory) => {
  const totalCost = quantity * cost;
  if (inventoryStore.points >= totalCost) {
    for (let i = 0; i < quantity; i++) {
      inventoryStore.buyItem(cost, item);
    }
    if (inventoryStore.inventory[item] >= 10) {
      inventoryStore.buyItem(0, 'honorBall');  // Ajout de l'Honor Ball
      alert(`Achat réussi ! Il vous reste ${inventoryStore.points} points. Vous avez reçu une Honor Ball en cadeau !`);
    } else {
      alert(`Achat réussi ! Il vous reste ${inventoryStore.points} points.`);
    }
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

    <div class="items-container2">
      <button :disabled="inventoryStore.points < pokeBallCost * 10" @click="buyItemBulk(10, pokeBallCost, 'pokeBall')">
        <img :src="pokeBallImg" alt="Poké Ball" />
        <p>Acheter 10 Poké Balls ({{ pokeBallCost * 10 }} points)</p>
      </button>

      <button :disabled="inventoryStore.points < superBallCost * 10"
        @click="buyItemBulk(10, superBallCost, 'superBall')">
        <img :src="superBallImg" alt="Super Ball" />
        <p>Acheter 10 Super Balls ({{ superBallCost * 10 }} points)</p>
      </button>

      <button :disabled="inventoryStore.points < hyperBallCost * 10"
        @click="buyItemBulk(10, hyperBallCost, 'hyperBall')">
        <img :src="hyperBallImg" alt="Hyper Ball" />
        <p>Acheter 10 Hyper Balls ({{ hyperBallCost * 10 }} points)</p>
      </button>
    </div>
  </div>
</template>

<style scoped>
.items-container {
  display: flex;
  justify-content: center;
  margin-top: -22%;
  gap: 20px;
}

.items-container2 {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 50px;
}

@media (max-width: 850px) {
  .items-container, .items-container2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -60%;
  }

  .items-container2 {
    margin-top: 20px;
  }

  button {
    width: 100%;
    max-width: 300px;
    margin-bottom: 10px;
  }
}

@media (max-width: 500px) {
  .items-container, .items-container2 {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -90%;
    margin-left: 10em;
  }

  .items-container2 {
    margin-top: 20px;
  }

  button {
    width: 100%;
    max-width: 300px;
    margin-bottom: 10px; 
  }
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
