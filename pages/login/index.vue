<template>
  <v-container>
    <v-row>
      <!-- Login Form -->
      <v-col cols="12" sm="6">
        <v-form @submit.prevent="login()">
          <v-subheader class="text-h4 mb-8 ml-0 pl-0">Login</v-subheader>
          <v-text-field
            v-model="currentUserLoginForm.email"
            label="Email"
            type="email"
          />
          <v-text-field
            v-model="currentUserLoginForm.password"
            label="Password"
            type="password"
          />
          <v-btn type="submit">Login</v-btn>
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-subheader class="text-h6 mt-8 ml-0 pl-0"
          >No account yet?</v-subheader
        >
        <v-btn to="/register">Register</v-btn>
      </v-col>
    </v-row>
    <v-alert
      v-if="loginSuccessful"
      outlined
      class="mt-5"
      type="success"
      prominent
      border="left"
    >
      Successfully logged in! Redirecting to TODOS in 5 seconds...
    </v-alert>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      currentUserLoginForm: {
        email: '',
        password: '',
      },
      tokenIsStored: false,
    }
  },
  computed: {
    ...mapState('user', ['user']),
    loginSuccessful() {
      if (this.tokenIsStored) return true
      else return false
    },
  },
  methods: {
    ...mapActions('user', ['loginUser']),

    login() {
      this.loginUser(this.currentUserLoginForm)
      if (localStorage.getItem('token')) {
        this.tokenIsStored = true
        setTimeout(() => this.$router.push({ path: '/todos' }), 5000)
      } else this.tokenIsStored = false
    },
  },
}
</script>
