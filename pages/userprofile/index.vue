<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4">
        <v-avatar size="1">
          <img :src="userprofile.image" />
        </v-avatar>
        <v-file-input
          ref="fileInput"
          v-model="selectedFile"
          label="Upload profile image"
        ></v-file-input>
      </v-col>
      <v-col cols="12" md="8">
        <v-form ref="form">
          <v-text-field
            v-model="userprofile.first_name"
            label="First Name"
          ></v-text-field>
          <v-text-field
            v-model="userprofile.last_name"
            label="Last Name"
          ></v-text-field>
          <v-text-field
            v-model="userprofile.facebook_profile"
            label="Facebook Profile"
          ></v-text-field>
          <v-text-field
            v-model="userprofile.linkedin_profile"
            label="LinkedIn Profile"
          ></v-text-field>
          <v-text-field
            v-model="userprofile.website"
            label="Website"
          ></v-text-field>
          <v-btn @click="submitForm">Save Changes</v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      selectedFile: null,
    }
  },
  computed: {
    ...mapState('user', ['user', 'userprofile']),
  },

  created() {
    this.getMyUser()
  },

  methods: {
    ...mapMutations('user', ['edit']),
    ...mapActions('user', ['getMyUser', 'updateUserProfile']),
    // async uploadImage() {
    //   const formData = new FormData()
    //   formData.append('image', this.selectedFile)
    //   const config = {
    //     headers: {
    //       'content-type': 'multipart/form-data'
    //     }
    //   }
    //   try {
    //     const response = await this.$axios.post('/userprofile/image', formData, config)
    //     this.userprofile.image = response.data.image
    //   } catch (error) {
    //     console.error(error)
    //   }
    // },
    async submitForm() {
      const id = this.userprofile.id
      const userDataAndProfileData = {
        email: this.user.email,
        first_name: this.userprofile.first_name,
        last_name: this.userprofile.last_name,
        facebook_profile: this.userprofile.facebook_profile,
        linkedin_profile: this.userprofile.linkedin_profile,
        website: this.userprofile.website,
        image: this.selectedFile,
      }
      try {
        await this.updateUserProfile(
          id,
          userDataAndProfileData,
          this.selectedFile
        )
        this.$refs.form.reset()
        this.$refs.fileInput.reset()
      } catch (error) {
        console.error(error)
      }
    },
  },
}
</script>
<style>
.v-file-input__text {
  height: 12px;
}
</style>
