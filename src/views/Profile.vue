<template>
  <SystemBar/>
  <v-container
    style="border:2px solid #fdf;border-radius: 1rem ; width: 50rem"
  >
    <v-card variant="flat">
      <v-card-title>Name: {{ name }}</v-card-title>
      <v-chip
        v-if="admin==='admin'"
        variant="elevated"
        color="primary"
        style="margin: 1rem;"
      >
        Admin
      </v-chip>
      <v-card-subtitle>Email: {{ email }}</v-card-subtitle>
      <v-card-text>Id: {{ id }}</v-card-text>
    </v-card>
  </v-container>
</template>
<script setup>
import SystemBar from "@/components/AppBar.vue";

let name = localStorage.getItem('name');
let id = localStorage.getItem('userId');
let email = localStorage.getItem('email');
let loggedIn = localStorage.getItem('authorized');
let admin = localStorage.getItem('role');

</script>
<style scoped>

</style>
