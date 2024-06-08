<template>
  <div class="text-center ma-2">
    <v-snackbar
      v-model="notification"
      :color="notificationColor"
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
  <v-sheet width="450" height="500" class="mx-auto mt-10 pa-10 " style="border-radius: 1rem" elevation="3" rounded>
    <div style="text-align: center;">
      <v-card-title class="mb-5">
        <b> Forgot Password </b>
      </v-card-title>
    </div>
    <v-form @submit.prevent>
      <v-text-field
        v-model="emailAddress"
        label="Enter your Email"
        density="compact"
        type="text"
        variant="outlined"
        color="blue"
        :rules="emailRules"
        validate-on="input"
      >

      </v-text-field>
      <v-btn
        type="submit"
        @click="sendEmail"
        block="true"
        :disabled="!validEmail"
        rounded
        class="mt-7 mb-10"
        color="blue"
        :loading="loading"
      >
        get reset link
      </v-btn>

      <router-link to="/login" style="text-decoration: none;">
        <v-btn block="true" flat="true" variant="outlined" color="indigo" rounded ripple>Back to login</v-btn>
      </router-link>
    </v-form>

  </v-sheet>

</template>

<style scoped>

</style>
<script setup>
import {ref} from 'vue';
import axios from "axios";
import apiRoute from "../../api";
import {useRoute, useRouter} from 'vue-router'

const router = useRouter()
const route = useRoute()

let emailAddress = ref('');
let loading = ref(false);
let validEmail = ref(false);

let notification = ref(false);
let notificationText = ref('');
let notificationColor = ref('blue');

function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const emailRules = [
  value => {
    if (value) {
      return true
    }

    return 'You must enter your email id.'
  },
  value => {
    if (emailIsValid(value)) {
      validEmail.value = true
      return true
    }
    validEmail.value = false
    return "Please enter a valid email."
  }
];

async function sendEmail() {
  loading.value = true;
  const postData = {
    email: emailAddress.value
  };

  try {
    notificationText.value = "Password Reset Link sent to your Email";
    notificationColor.value = "green";

    const response = await axios.post(apiRoute.forgotPassword, postData);
    if (response.status === 200) {
      notification.value = true;
      loading.value = false;
      setTimeout(async () => {
        notification.value = false;
        await router.push('/');
      }, 2000);
    }
    console.log({response})
  } catch (err) {
    console.log("IM HERE")
    console.log(err)
    if (err.response && err.response.status === 404) {
      notificationText.value = "User Doesn't Exist";
    } else {
      notificationText.value = "Internal Server Error";
    }
    notificationColor.value = "red";
    notification.value = true;
    loading.value = false;

    setTimeout(async () => {
      console.log(err);
      notification.value = false
    }, 2000);
  }
}

</script>
