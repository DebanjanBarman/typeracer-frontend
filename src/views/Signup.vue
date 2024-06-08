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
  <v-sheet width="450" height="600" class="mx-auto mt-10 pa-10 " style="border-radius: 1rem" elevation="3" rounded>
    <div style="text-align: center;">
      <v-card-title class="mb-5">
        <b>
          Sign up
        </b>
      </v-card-title>
    </div>
    <v-form @submit.prevent>
      <v-text-field
        v-model="name"
        label="Full Name"
        density="compact"
        class="mb-5 mt-10"
        type="text"
        variant="outlined"
        :rules="nameRules"
        validate-on="input"
        color="blue"
      ></v-text-field>

      <v-text-field
        v-model="email"
        label="Email"
        density="compact"
        class="mb-5"
        type="email"
        variant="outlined"
        color="blue"
        :rules="emailRules"
        validate-on="input"
      >
      </v-text-field>
      <v-text-field
        v-model="password"
        label="Password"
        density="compact"
        variant="outlined"
        color="blue"
        class="mb-5"
        append-inner-icon="mdi-eye"
        :type="showPassword ? 'text' : 'password'"
        @click:append-inner="toggle"
        :rules="passwordRules"
        validate-on="input"
      >
      </v-text-field>

      <v-btn
        type="submit"
        block="true"
        :loading="loading"
        @click="signUp"
        rounded
        class="mt-7 mb-10"
        :disabled="!validEmail||!validPassword||!validName"
        color="blue">
        Sign up
      </v-btn>

      <p class="mb-4"> Already have an account?</p>
      <router-link to="/login" style="text-decoration: none;color: #3178ec">
        <b>Sign in</b>
      </router-link>
    </v-form>

  </v-sheet>

</template>

<script setup>
import {ref} from "vue";
import axios from "axios";
import apiRoute from "../../api";
import {useRoute, useRouter} from 'vue-router'

const router = useRouter()
const route = useRoute()

let name = ref('');
let email = ref('');
let password = ref('');

let loading = ref(false);
let showPassword = ref(false);
let validPassword = ref(false);
let validEmail = ref(false);
let validName = ref(false);

let notification = ref(false);
let notificationText = ref('');
let notificationColor = ref('blue');

function toggle() {
  showPassword.value = !showPassword.value;
}

function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function strongPassword(pass) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pass)
}

const nameRules = [

  value => {
    if (value.length >= 3) {
      validName.value = true;
      return true;
    }
    return 'Name must have at least 3 letters.'
  },
]

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
const passwordRules = [
  value => {
    if (value.length >= 8) {
      return true
    } else {
      return 'Password must have at least 8 characters.'
    }
  },
  value => {
    if (strongPassword(value)) {
      validPassword.value = true;
      return true
    } else {
      validPassword.value = false;
      return "Password must contain Uppercase,Lowercase,Number,Special Character"
    }
  }
];


async function signUp() {
  loading.value = true;
  const postData = {
    name: name.value,
    email: email.value.toLowerCase(),
    password: password.value
  };

  try {
    notificationText.value = "Account Created";
    notificationColor.value = "green";

    const response = await axios.post(apiRoute.signup, postData);
    if (response.status === 201) {
      notification.value = true;
      loading.value = false;
      setTimeout(async () => {
        notification.value = false;
        await router.push('/login');
      }, 2000);
    }
    console.log({response})
  } catch (err) {
    console.log("IM HERE")
    console.log(err)
    notificationText.value = "User Already Exists";
    notificationColor.value = "red";
    notification.value = true;
    loading.value = false;

    setTimeout(async () => {
      console.log(err);
      notification.value = false
    }, 1000);

  }

}
</script>


<style scoped>

</style>
