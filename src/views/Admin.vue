<template>
  <SystemBar/>
  <v-container>
    <v-row>
      <v-col></v-col>
      <v-col cols="2">
        <v-btn
          variant="outlined"
          color="success"
          prepend-icon="mdi-plus"
          to="admin/new"
        >
          New Game
        </v-btn>
      </v-col>

    </v-row>

    <v-row>
      <v-col
        v-for="game in gameArray"
        :key="game.id"
      >
        <router-link :to="`/admin/${game.id}`" style="text-decoration: none">
          <v-card variant="elevated" style="width: 20rem">
            <v-card-item>
              <v-card-title>
                {{ game.name }}
              </v-card-title>
              <v-card-subtitle>
                {{ new Date(game.start_time).toDateString() }}
              </v-card-subtitle>
            </v-card-item>

          </v-card>
        </router-link>
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


<style scoped>

</style>
