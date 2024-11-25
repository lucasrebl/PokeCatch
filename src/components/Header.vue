<template>
    <Slide v-if="isMobile" right :closeOnNavigation="true">
        <RouterLink to="/" class="logoBurger">
            <img src="@/assets/PokeCatchLogo.png" alt="Logo" class="logoBurger" />
        </RouterLink>
        <RouterLink to="/pokemon-info"><button class="burgerBtn">pokemon info</button></RouterLink>
        <RouterLink to="/"><button class="burgerBtn">Pokédex</button></RouterLink>
        <RouterLink to="/shop"><button class="burgerBtn">Shop</button></RouterLink>
        <RouterLink to="/catch-land"><button class="burgerBtn">Catch land</button></RouterLink>
    </Slide>
    <header :class="{ hidden: isHidden }" @scroll="handleScroll">
        <div class="header-content">
            <RouterLink to="/" class="logo">
                <img src="@/assets/PokeCatchLogo.png" alt="Logo" class="logo" />
            </RouterLink>
            <div v-if="!isMobile" class="buttons">
                <RouterLink to="/pokemon-info"><button>Pokémon info</button></RouterLink>
                <RouterLink to="/"><button>Pokédex</button></RouterLink>
                <RouterLink to="/shop"><button>Shop</button></RouterLink>
                <RouterLink to="/catch-land"><button>Catch land</button></RouterLink>
            </div>
        </div>
    </header>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink } from 'vue-router'
import { Slide } from 'vue3-burger-menu'

export default defineComponent({
    components: {
        RouterLink,
        Slide,
    },
    setup() {
        const lastScrollY = ref<number>(0)
        const isHidden = ref<boolean>(false)
        const isMobile = ref<boolean>(window.innerWidth <= 750)

        const handleScroll = () => {
            const currentScrollY = window.scrollY
            isHidden.value = currentScrollY > lastScrollY.value
            lastScrollY.value = currentScrollY
        }

        const handleResize = () => {
            isMobile.value = window.innerWidth <= 750
        }

        onMounted(() => {
            window.addEventListener('scroll', handleScroll)
            window.addEventListener('resize', handleResize)
        })

        onBeforeUnmount(() => {
            window.removeEventListener('scroll', handleScroll)
            window.removeEventListener('resize', handleResize)
        })

        return {
            isHidden,
            isMobile,
        }
    },
})
</script>

<style scoped>
::v-deep(.bm-burger-button) {
    z-index: 100;
    left: auto;
    right: 36px;
    top: 20px;
    position: fixed;
}

.logoBurger {
    height: 50px;
}

.burgerBtn {
    font-family: 'Oswald', sans-serif;
    margin-left: 25px;
    padding: 5px 25px;
    filter: drop-shadow(4px 10px rgba(0, 0, 0, 0));
    background: transparent;
    outline: none;
    border: none;
    transition: 0.2s;
    font-size: 25px;
    color: white;
    font-weight: 700;
}

.burgerBtn:hover {
    color: rgba(0, 182, 94, 0.759);
}

header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    transition: top 0.3s;
    z-index: 99;
    backdrop-filter: blur(4.7px);
    -webkit-backdrop-filter: blur(4.7px);
}

button:hover {
    cursor: pointer;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 20px;
}

.logo {
    height: 40px;
}

.logo:hover {
    cursor: pointer;
}

.buttons button {
    font-family: 'Oswald', sans-serif;
    margin-left: 25px;
    padding: 5px 25px;
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    outline: none;
    border: none;
    border-radius: 50px;
    transition: 0.2s;
    font-weight: 700;
}

.buttons button:hover {
    background-color: black;
    color: white;
}

.hidden {
    top: -100px;
}
</style>
