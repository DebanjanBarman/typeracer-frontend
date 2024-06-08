<template>
  <SystemBar/>
  <v-container>
    <v-row>
      <v-col
        v-for="game in gameArray"
        :key="game.id"
      >
        <v-card variant="elevated" style="width: 20rem">
          <router-link :to="`game/${game.id}`" style="text-decoration: none;color: #232121">
            <v-card-item>
              <v-card-title>
                {{ game.name }}
              </v-card-title>
              <v-card-subtitle>
                {{ new Date(game.start_time).toDateString() }}
              </v-card-subtitle>
              <v-card-subtitle>
                {{ game.organizer }}
              </v-card-subtitle>

            </v-card-item>

          </router-link>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup>
import SystemBar from "@/components/AppBar.vue";
import {onMounted, ref} from "vue";
import axios from 'axios';
import apiRoute from '../../api/index'

let gameArray = ref([])

async function getProducts() {
  const response = await axios.get(apiRoute.gamesURL);
  gameArray.value = response.data;
}

onMounted(async () => {
  await getProducts();
})

</script>
