<template>
  <v-app dark>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-toolbar-title class="mr-15">{{ title }}</v-toolbar-title>
      <v-text-field
        class="mr-15"
        dense
        outlined
        background-color="white"
        placeholder="search for task here..."
        hide-details
        append-icon="mdi-magnify"
      ></v-text-field>
      <v-toolbar-items>
        <v-btn text to="/todos">Todos</v-btn>
        <v-btn text to="/notes">Notes</v-btn>
      </v-toolbar-items>
      <!-- START STATUSBAR -->
      <v-container class="resize ml-5">
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
              <v-img src="https://cdn.vuetifyjs.com/images/lists/2.jpg"></v-img>
            </v-avatar>
          </v-badge>
        </v-row>
      </v-container>
      <v-icon class="ml-5">mdi-logout</v-icon>
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
export default {
  name: 'DefaultLayout',
  data() {
    return {
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
}
</script>

<style>
.resize {
  width: 40px;
  height: 40px;
}
</style>
