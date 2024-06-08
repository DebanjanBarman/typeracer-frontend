<template>
  <SystemBar/>
  <v-container style="margin-top: 2rem">
    <v-form fast-fail :disabled="saved" validate-on="input" @submit.prevent="createGame">
      <v-text-field
        variant="outlined"
        v-model="games.name"
        :rules="nameRules"
        label="Tournament Name"
      >
      </v-text-field>

      <label></label>
      <v-text-field
        variant="outlined"
        v-model="games.start_time"
        :rules="rules"
        label="Starting Time: in the given format (2024-05-13T13:13:45.00Z)"
      >
      </v-text-field>
      <v-text-field
        variant="outlined"
        v-model="games.organizer"
        :rules="nameRules"
        label="Organizer"
      >
      </v-text-field>
      <v-textarea
        variant="outlined"
        v-model="games.paragraph"
        :rules="paraRules"
        label="Paragraph to type"
      >
      </v-textarea>
      <v-btn
        variant="outlined"
        color="success"
        class="ma-2 px-2"
        type="submit"
        :loading="saving"
        @click.prevent="createGame"
      >
        <v-icon>mdi-floppy</v-icon>
        Create
      </v-btn>

    </v-form>

  </v-container>
</template>

<script setup>
import SystemBar from "@/components/AppBar.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";
import axios from "axios";
import apiRoute from "../../api";

let games = ref({});
const router = useRouter()
let saving = ref(false);
let saved = ref(false)

const nameRules = [
  value => {
    if (value?.length > 3) return true

    return 'Name must be at least 5 characters.'
  },
]
const paraRules = [
  value => {
    if (value?.length > 3) return true

    return 'Paragraph must be at least 100 characters.'
  },
]

async function createGame() {
  saving.value = true;

  const createData = {
    name: games.value.name,
    start_time: games.value.start_time,
    paragraph: games.value.paragraph,
    organizer: games.value.organizer
  };
  console.log(createData)
  try {
    const response = await axios.post(apiRoute.gamesURL, createData, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    });
    games.value = response.data;

    saving.value = false;
    saved.value = true;
    await router.push("/")

  } catch (e) {
    console.log(e);
    saving.value = false;
  }

}

</script>
<style scoped>

</style>
