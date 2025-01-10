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

  <v-container
    v-if="gameArray.length===0"
    style="border:2px solid #fdf;border-radius: 1rem ; width: 100%; height: 70vh;">
    <v-row>
      <v-col cols="12">
        <v-card-title
          style="margin-top: 18%;margin-left: 50%;transform: translateX(-50%);width: 300px">
          Games will appear here
        </v-card-title>
      </v-col>
    </v-row>
  </v-container>

</template>

<script setup>
import SystemBar from "@/components/AppBar.vue";
import {onMounted, ref} from "vue";
import axios from 'axios';
import apiRoute from '../../api/index'
import {io} from "socket.io-client";

const socket = io(apiRoute.baseURL);

socket.on("connect", () => {
  console.log(socket.id);
});
socket.on("connect_error", () => {
  // revert to classic upgrade
  socket.io.opts.transports = ["polling", "websocket"];
});


let gameArray = ref([])

async function getProducts() {
  const response = await axios.get(apiRoute.gamesURL);
  gameArray.value = response.data;
}

onMounted(async () => {
  await getProducts();
})

socket.on("updated", async (arg) => {
  await getProducts();
});
socket.on("*", async (arg) => {
  console.log(arg)
});

// await broadcastMessage("updated")

</script>
