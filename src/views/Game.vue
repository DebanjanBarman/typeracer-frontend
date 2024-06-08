<template>

  <SystemBar/>
  <div class="text-center ma-2">
    <v-snackbar
      v-model="notification"
      variant="elevated"
      color="primary"
    > {{ notificationText }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="notification = false"
        > Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
  <v-row style="margin-top: 2rem">
    <v-col style="max-width: 55rem;margin: auto 0 auto auto;">
      <v-card variant="outlined">
        <v-card-item class="unselectable">
          <typing v-for="chars in games.paragraph">{{ chars }}</typing>
        </v-card-item>
      </v-card>
      <v-textarea
        variant="outlined"
        v-model="paragraph"
        style="margin-top: 1rem"
        @input="check"
        id="textarea1"
        :disabled="participated"
      >
      </v-textarea>

    </v-col>
    <v-col cols="3">
      <v-chip class="unselectable" prepend-icon="mdi-timer-outline" variant="outlined"
              size="default"
              density="comfortable"
              style="margin-left: 30%">
        {{ timeTaken }} seconds
      </v-chip>
      <v-container
        v-if="(timeTaken>0 && timer===false)|| participated"
        class="leaderboard"
      >
        <div style="text-align: center;">
          <h3>
            Leaderboard
          </h3>
        </div>
        <v-table>
          <thead>
          <tr>
            <th class="text-left">
              Position
            </th>
            <th class="text-left">
              Name
            </th>
            <th class="text-left">
              Time Taken(sec)
            </th>
          </tr>
          </thead>
          <tbody>
          <tr
            v-for="(perf,i) in leaderboard"
            :key="i"
          >
            <td>{{ i + 1 }}</td>
            <td>{{ perf.name }}</td>
            <td>{{ perf.time_taken }}</td>
          </tr>
          </tbody>
        </v-table>

      </v-container>
    </v-col>
  </v-row>

</template>
<script setup>

import SystemBar from "@/components/AppBar.vue";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import axios from "axios";
import apiRoute from "../../api";

const route = useRoute()
const router = useRouter()

const id = route.params.id;

let games = ref({});
let paragraph = ref([]);
let timer = ref(false);
let timeTaken = ref(0);
let leaderboard = ref();
let participated = ref();
let notification = ref(false);
let notificationText = ref("");

setInterval(async () => {
  if (timer.value === true) {
    timeTaken.value += 1;
  }
}, 1000);

async function checkParticipation() {
  try {
    const response = await axios.get(`${apiRoute.participation}?game=${id}&user=${localStorage.getItem("userId")}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    });
    participated.value = response.data;
    console.log("participation data")
    console.log(participated.value);

    if (participated.value === 1) {
      notification.value = true;
      notificationText.value = "Already participated in the match"
    }

  } catch (e) {
    console.log(e);
  }
}

async function getGame() {
  try {
    const response = await axios.get(`${apiRoute.gamesURL}/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    });
    games.value = response.data;
  } catch (e) {
    console.log(e);
  }
}

async function getLeaderboard() {
  try {
    const response = await axios.get(`${apiRoute.leaderBoard}/${id}`, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    });
    leaderboard.value = response.data;
  } catch (e) {
    console.log(e);
  }

}

async function saveResult() {
  try {
    const response = await axios.post(`${apiRoute.savePerformance}`, {
      user_id: localStorage.getItem("userId"),
      game_id: id,
      time_taken: timeTaken.value
    });
    console.log(response);
  } catch (e) {
    console.log(e);
  }
}

async function check() {
  timer.value = true;
  let correct = true;
  const arrayQuote = document.querySelectorAll("typing");
  const arrayValue = paragraph.value.split('');


  arrayQuote.forEach((charSpan, index) => {
    const character = arrayValue[index];

    if (character == null) {
      charSpan.classList.remove("correct");
      charSpan.classList.remove("incorrect");
      correct = false;
    } else if (character === charSpan.innerText) {
      charSpan.classList.add("correct");
      charSpan.classList.remove("incorrect");
    } else {
      charSpan.classList.add("incorrect");
      charSpan.classList.remove("correct");
      correct = false;
    }
  })
  if (correct) {
    timer.value = false;
    document.getElementById("textarea1").disabled = true;
    try {
      await saveResult();
      await getLeaderboard();
    } catch (e) {
      console.log(e);
    }
  }
}

onMounted(() => {
  getGame();
  checkParticipation()
  getLeaderboard();
})

</script>

<style scoped>

.correct {
  background-color: lawngreen;
  padding-top: 5px;
  padding-bottom: 5px;
}

.incorrect {
  background-color: red;
  font-size: large;
  padding-top: 5px;
  padding-bottom: 5px;

}

.normal {
  background-color: white;
  color: black;
}

.unselectable {
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.leaderboard {
  background-color: rgba(217, 216, 216, 0);
  margin-top: 1rem;
  margin-right: 1rem;
  border-radius: 7px;
  outline: 1px solid black;
}
</style>
