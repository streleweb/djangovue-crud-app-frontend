<template>
  <v-container>
    <v-row>
      <!-- Register Form -->
      <v-col cols="12" sm="6">
        <v-subheader class="text-h4 mb-8 ml-0 pl-0">Register</v-subheader>
        <v-form @submit.prevent="register()">
          <v-text-field
            v-model="currentUserRegisterForm.email"
            label="Email"
            type="email"
          />
          <v-text-field
            v-model="currentUserRegisterForm.password"
            label="Password"
            type="password"
          />
          <v-btn type="submit">Register</v-btn>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-subheader class="text-h6 mt-8 ml-0 pl-0"
          >Already registered?</v-subheader
        >
        <v-btn to="/login">Login</v-btn>
      </v-col>
    </v-row>

    <v-alert
      v-if="registrationSuccesful"
      outlined
      class="mt-5"
      type="success"
      prominent
      border="left"
    >
      Successfully registered! Redirecting to Login-Page in 5 seconds...
    </v-alert>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      currentUserRegisterForm: {
        email: '',
        password: '',
      },
      registrationSuccesful: false,
    }
  },
  computed: {
    ...mapState('user', ['user']),
  },
  methods: {
    ...mapActions('user', ['registerNewUser']),

    register() {
      this.registerNewUser(this.currentUserRegisterForm)
      this.registrationSuccesful = true
      setTimeout(() => this.$router.push({ path: '/login' }), 5000)
    },
  },
}
</script>
