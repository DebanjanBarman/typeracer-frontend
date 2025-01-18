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
  <!--  <v-row style="margin-top: 2rem">-->
  <!--    <v-col style="max-width: 55rem;margin: auto 0 auto auto;">-->

  <!--    </v-col>-->
  <!--    <v-col cols="3">-->

  <!--    </v-col>-->
  <!--  </v-row>-->
  <v-row>
    <v-col style="max-width: 55rem;margin: auto;">
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
              Email
            </th>
            <th class="text-left">
              Time Taken(sec)
            </th>
            <th class="text-left">
              WPM
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
            <td>{{ perf.email }}</td>
            <td>{{ perf.time_taken }}</td>
            <td>{{ ((paragraph_len * 60) / (5 * perf.time_taken)).toFixed(1) }}</td>
          </tr>
          </tbody>
        </v-table>

      </v-container>

    </v-col>
  </v-row>

  <v-row no-gutters v-if="!participated && !typing_complete">
    <v-col cols="8">
      <v-sheet class="pa-4 ma-4">
        <v-card variant="flat" style="  border:2px solid #fdf;  border-radius: 1rem ;">
          <v-card-item class="unselectable">
            <typing v-for="chars in games.paragraph">{{ chars }}</typing>
          </v-card-item>
        </v-card>
        <v-textarea
          variant="plain"
          v-model="paragraph"
          style="border:2px solid #fdf;margin-top: 1rem;border-radius: 1rem ; padding-left: 1rem;padding-right: 1rem"
          @input="check"
          id="textarea1"
        >
          <!--          @keydown="disable_control"-->

        </v-textarea>
      </v-sheet>
    </v-col>

    <v-col cols="4">
      <!--      <v-row>-->

      <v-sheet class="pa-4 ma-4">
        <v-chip class="unselectable" prepend-icon="mdi-timer-outline" variant="outlined"
                size="large"
                v-if="!participated"
                style="margin-left: 50%;translate: -50%;border-radius: 1rem ;border:2px solid #fdf;">
          {{ timeTaken }} seconds
        </v-chip>
      </v-sheet>
      <!--      </v-row>-->
      <v-row>
        <v-card-title style="margin-left: 42%">
          Note
        </v-card-title>
        <v-row style="margin-top: 1rem;padding: 2rem">
          1. You have to maintain 100% accuracy, otherwise the test will not submit.
          <br>
        </v-row>
      </v-row>

    </v-col>
  </v-row>
</template>
<script setup>

import SystemBar from "@/components/AppBar.vue";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import axios from "axios";
import apiRoute from "../../api";
import {io} from "socket.io-client";

const socket = io(apiRoute.baseURL);

socket.on("connect", () => {
  console.log(socket.id);
});
socket.on("connect_error", () => {
  // revert to classic upgrade
  socket.io.opts.transports = ["polling", "websocket"];
});

const route = useRoute()
const router = useRouter()

const id = route.params.id;

let games = ref({});
let paragraph = ref("");
let paragraph_len = ref(0);
let timer = ref(false);
let timeTaken = ref(0);
let leaderboard = ref();
let participated = ref();
let notification = ref(false);
let notificationText = ref("");
let typing_complete = ref(false);

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
    paragraph_len.value = response.data.paragraph.length;
  } catch (e) {
    console.log("HELLO THERE");
    console.log(e.response.status);
    if (e.response.status === 401) {
      localStorage.clear();
      await router.push("/login")
    }
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

async function disable_control(e) {
  console.log(e)
}

async function check(e) {
  timer.value = true;
  let correct = true;
  const arrayQuote = document.querySelectorAll("typing");
  const arrayValue = paragraph.value.split('');

  // console.log(e)
  if (e.inputType === "insertLineBreak") {
    // let len = paragraph.value.length;
    //
    // // if (paragraph.value[len - 1] === '\n') {
    // let usertext = paragraph.value;
    // usertext.substring(0, usertext.length - 1);
    // // console.log(str);    //   console.log(usertext)
    // //   usertext.;
    // paragraph.value = usertext;
    //
    // // }
    // console.log(paragraph.value[len - 1]);
    // // paragraph.value.pop();
    // await this.$nextTick();
  }

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
    typing_complete.value = true
    document.getElementById("textarea1").disabled = true;
    try {
      await saveResult();
      await getLeaderboard();
      notification.value = true;
      notificationText.value = "You've Finished the game"
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

socket.on("updated", async (arg) => {
  await getLeaderboard();
});
socket.on("*", async (arg) => {
  console.log(arg)
});
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
  border: 2px solid #fdf;
  border-radius: 1rem;
}
</style>
