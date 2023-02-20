<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-avatar size="1">
          <img :src="user.userProfile.image" />
        </v-avatar>
        <v-file-input
          ref="fileInput"
          v-model="selectedFile"
          @change="uploadImage"
          label="Upload profile image"
        ></v-file-input>
      </v-col>
      <v-col cols="12" md="8">
        <v-form ref="form">
          <v-text-field
            v-model="user.userProfile.first_name"
            label="First Name"
          ></v-text-field>
          <v-text-field
            v-model="user.userProfile.last_name"
            label="Last Name"
          ></v-text-field>
          <v-text-field
            v-model="user.userProfile.facebook_profile"
            label="Facebook Profile"
          ></v-text-field>
          <v-text-field
            v-model="user.userProfile.linkedin_profile"
            label="LinkedIn Profile"
          ></v-text-field>
          <v-text-field
            v-model="user.userProfile.website"
            label="Website"
          ></v-text-field>
          <v-btn @click="submitForm">Save Changes</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      selectedFile: null,
    }
  },
  computed: {
    ...mapState('user', ['user.userProfile']),
  },
  methods: {
    async submitForm() {
      try {
        const response = await axios.post('/userprofile', this.user)
        console.log(response.data)
      } catch (error) {
        console.error(error)
      }
    },
    async uploadImage() {
      //   const formData = new FormData()
      //   formData.append('image', this.selectedFile)
      //   try {
      //     const response = await axios.post('/userprofile/image', formData)
      //     this.userProfile.image = response.data.image
      //   } catch (error) {
      //     console.error(error)
      //   }
    },
  },
}
</script>

<style>
.v-file-input__text {
  height: 12px;
}
</style>
