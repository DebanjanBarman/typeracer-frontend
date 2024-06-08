<template>
  <SystemBar/>
  <v-dialog
    v-model="dialog"
    width="auto"
  >
    <v-card
      max-width="400"
      prepend-icon="mdi-delete"
      style="color: red"
      text="This step is irreversible, you won't be able to restore the game after deletion"
      title="Confirm Deletion"
      :loading="deleting"
    >
      <template v-slot:actions>
        <v-spacer></v-spacer>
        <v-btn
          text="Cancel"
          color="primary"
          variant="outlined"
          @click="dialog = !dialog"
        ></v-btn>
        <v-btn
          text="Delete"
          color="red"
          variant="outlined"
          @click="deleteGame"
          :loading="deleting"
        ></v-btn>

      </template>
    </v-card>
  </v-dialog>

  <div class="d-flex flex-row-reverse mb-6 mt-6 " style="width: 95%">
    <v-btn
      variant="outlined"
      color="red"
      class="ma-2 px-2"
      @click="dialog=!dialog"
    >
      <v-icon>mdi-delete</v-icon>
      Delete
    </v-btn>
    <v-btn
      variant="outlined"
      :disabled="!editing"
      color="success"
      class="ma-2 px-2"
      :loading="saving"
      @click="updateGame"
    >

      <v-icon>mdi-floppy</v-icon>
      Save
    </v-btn>
    <v-btn
      variant="outlined"
      :disabled="editing"
      color="warning"
      class="ma-2 px-2"
      @click="editing=!editing"
    >
      <v-icon>mdi-pencil</v-icon>
      Edit
    </v-btn>
  </div>
  <v-container style="margin-top: 2rem">
    <v-form :disabled="!editing" validate-on="input" @submit.prevent="updateGame">
      <v-text-field
        variant="outlined"
        v-model="games.name"
        :rules="rules"
        label="Tournament Name"
      >
      </v-text-field>
      <v-text-field
        variant="outlined"
        v-model="games.start_time"
        :rules="rules"
        label="Starting Time"
      >
      </v-text-field>
      <v-text-field
        variant="outlined"
        v-model="games.organizer"
        :rules="rules"
        label="Organizer"
      >
      </v-text-field>
      <v-textarea
        variant="outlined"
        v-model="games.paragraph"
        :rules="rules"
        label="Paragraph to type"
      >
      </v-textarea>
    </v-form>

  </v-container>
</template>

<script setup>
import SystemBar from "@/components/AppBar.vue";
import {onMounted, ref} from "vue";
import axios from "axios";
import apiRoute from "../../api";
import {useRoute, useRouter} from "vue-router";

let games = ref({});
const route = useRoute()
const router = useRouter()
let saving = ref(false);
let editing = ref(false);
let deleting = ref(false);
let dialog = ref(false);

const id = route.params.id;

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

async function updateGame() {
  saving.value = true;

  const updateData = {
    id: id,
    name: games.value.name,
    start_time: games.value.start_time,
    paragraph: games.value.paragraph,
    organizer: games.value.organizer
  };
  console.log(updateData)
  try {
    const response = await axios.patch(apiRoute.gamesURL, updateData, {
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    });
    games.value = response.data;

    saving.value = false;
    editing.value = false;
    await router.push("/admin")

  } catch (e) {
    console.log(e);
    saving.value = false;
  }

}

async function deleteGame() {
  deleting.value = true;

  try {
    const response = await axios.delete(apiRoute.gamesURL, {
      data: {id},
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
      }
    });
    deleting.value = false;
    await router.push("/admin")

  } catch (e) {
    deleting.value = false;

    console.log(e);
    saving.value = false;
  }

}

onMounted(async () => {
  await getGame();
})

</script>
<style scoped>

</style>
