<template>
  <v-app dark>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-toolbar-title class="mr-15">{{ title }}</v-toolbar-title>
      <v-text-field
        v-model="searchString"
        class="mr-15"
        dense
        outlined
        background-color="white"
        placeholder="search for task here..."
        hide-details
        append-icon="mdi-magnify"
        @keyup="handleSearchInput"
      />
      <v-toolbar-items>
        <v-btn text to="/todos">Todos</v-btn>
        <!-- <v-btn text to="/notes">Notes</v-btn> -->
      </v-toolbar-items>
      <!-- START STATUSBAR -->

      <v-container
        v-if="user.isAuthenticated"
        id="usercontainer"
        class="resize ml-5"
      >
        <router-link to="/userprofile">
          <v-row class="resize">
            <div class="mx-3"></div>

            <v-badge
              bordered
              bottom
              color="green accent-4"
              dot
              offset-x="10"
              offset-y="10"
            >
              <v-avatar size="40">
                <v-img :src="userprofile.image"></v-img>
              </v-avatar>
            </v-badge>
          </v-row>
        </router-link>
        <v-icon class="ml-6 mt-2" style="cursor: pointer" @click="logout"
          >mdi-logout</v-icon
        >
      </v-container>

      <!-- END STATUSBAR -->
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }} streleweb</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

export default {
  name: 'DefaultLayout',
  data() {
    return {
      searchString: '',
      auth: false,
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'ToDo-App',
    }
  },
  computed: {
    ...mapState('user', ['user', 'userprofile']),
    ...mapState('todos', ['todos']),

    searchStringChanged() {
      return this.searchString.trim()
    },
    userAuthenticated() {
      return this.user.isAuthenticated
    },
  },

  created() {
    // this.updateMyUser()
  },

  methods: {
    ...mapActions('user', ['getUserById', 'getMyUser']),
    ...mapMutations('todos', ['updateSearchString']),
    ...mapMutations('user', ['setIsAuthToFalse']),
    handleSearchInput() {
      this.updateSearchString(this.searchStringChanged)
    },

    logout() {
      localStorage.removeItem('token')
      localStorage.removeItem('id')
      this.setIsAuthToFalse()
      document.getElementById('usercontainer').style.display = 'none'

      this.$swal('Success!', 'Logged Out!')
      let timerInterval
      this.$swal
        .fire({
          title: 'Logged out!',
          timer: 1000,
          timerProgressBar: true,
          didOpen: () => {
            this.$swal.showLoading()
            const b = this.$swal.getHtmlContainer().querySelector('b')
            timerInterval = setInterval(() => {
              b.textContent = this.$swal.getTimerLeft()
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          },
        })
        .then((result) => {
          if (result.dismiss === this.$swal.DismissReason.timer) {
            console.log('I was closed by the timer')
          }
        })

      setTimeout(() => this.$router.push({ path: '/login' }), 1000)
    },

    updateMyUser() {
      this.getMyUser()
    },
  },
}
</script>

<style>
.resize {
  width: 40px;
  height: 40px;
}
</style>


