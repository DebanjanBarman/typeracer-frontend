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
          Reset password
        </b>
      </v-card-title>
    </div>
    <v-form @submit.prevent>
      <v-text-field
        v-model="password"
        id="password"
        label="Password"
        density="compact"
        class="mb-5 mt-10"
        variant="outlined"
        color="blue"
        append-inner-icon="mdi-eye"
        validate-on="input"
        @click:append-inner="toggle"
        :type="showPassword ? 'text' : 'password'"
        :rules="passwordRules"
      >
      </v-text-field>
      <v-text-field
        v-model="passwordConfirm"
        label="Confirm Password"
        density="compact"
        id="confirmPassword"
        variant="outlined"
        color="blue"
        class="mb-5"
        append-inner-icon="mdi-eye"
        @click:append-inner="toggle2"
        :type="showConfirmPassword ? 'text' : 'password'"
        :rules="passwordRules2"
        validate-on="input"
      >
      </v-text-field>

      <v-btn
        type="submit"
        block="true"
        :loading="loading"
        @click="resetPassword"
        rounded
        class="mt-7 mb-10"
        :disabled="!validPassword||!validConfirmPassword"
        color="blue">
        Reset
      </v-btn>

      <router-link to="/login" style="text-decoration: none;">
        <v-btn block="true" flat="true" rounded variant="outlined" color="indigo" ripple>Back to login</v-btn>
      </router-link>

      <!--      <p class="mb-4"> Already have an account?</p>-->
      <!--      <router-link to="/login" style="text-decoration: none;color: #3178ec">-->
      <!--        <b>Sign in</b>-->
      <!--      </router-link>-->
    </v-form>

  </v-sheet>

</template>

<script setup>
import {useRoute, useRouter} from 'vue-router'
import {ref} from "vue";
import axios from "axios";
import apiRoute from "../../api";

const router = useRouter()
const route = useRoute()

const TOKEN = route.params.token;

let password = ref('');
let passwordConfirm = ref('');

let loading = ref(false);

let showPassword = ref(false);
let showConfirmPassword = ref(false);

let validPassword = ref(false);
let validConfirmPassword = ref(false);

let notification = ref(false);
let notificationText = ref('');
let notificationColor = ref('blue');
const toggle = () => {
  showPassword.value = !showPassword.value;
  console.log(showPassword.value)
}

const toggle2 = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
  console.log(showConfirmPassword.value)
}

function strongPassword(pass) {
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(pass)
}

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

const passwordRules2 = [
  value => {
    if (value.length >= 8) {
      return true
    } else {
      return 'Password must have at least 8 characters.'
    }
  },
  value => {
    if (value === password.value) {
      validConfirmPassword.value = true;
      return true
    } else {
      validConfirmPassword.value = false;
      return 'Both Password must be same.'
    }
  },
]

async function resetPassword() {
  loading.value = true;
  const postData = {
    password: password.value,
    passwordConfirm: passwordConfirm.value
  };

  try {
    notificationText.value = "Password Reset Successful, Redirecting to Login";
    notificationColor.value = "green";

    const response = await axios.post(`${apiRoute.passwordReset}/${TOKEN}`, postData);
    if (response.status === 200) {
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
    notificationText.value = "Invalid/Expired Link";
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
