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
      v-if="user.isAuthenticated"
      outlined
      class="mt-5"
      type="success"
      prominent
      border="left"
    >
      Successfully logged in! Redirecting to TODOS in 3 seconds...
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
    }
  },
  computed: {
    ...mapState('user', ['user']),
    loginSuccessful() {
      if (this.tokenIsStored) return true
      else return false
    },
  },
  created() {
    if (this.user.isAuthenticated) {
      this.$router.push({ path: '/todos' })
    } else {
      this.user.isAuthenticated = false
      localStorage.removeItem('token')
      localStorage.removeItem('id')
    }
  },
  methods: {
    ...mapActions('user', ['loginUser', 'getMyUser']),

    login() {
      this.loginUser(this.currentUserLoginForm).then(() => {
        if (this.user.isAuthenticated) {
          this.getMyUser()
          document.getElementById('usercontainer').style.display = 'block'
          setTimeout(() => this.$router.push({ path: '/todos' }), 3000)
        }
      })
    },
  },
}
</script>
