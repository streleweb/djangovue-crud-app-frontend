<template>
  <v-container>
    <v-row v-if="authenticated">
      <v-col cols="12" md="4">
        <v-avatar size="20rem" class="mt-10">
          <v-img :src="userprofile.image" alt="John"></v-img>
        </v-avatar>
      </v-col>
      <v-col cols="12" md="8">
        <v-form @submit.prevent="submitForm()">
          <v-subheader class="text-h4 mb-8 ml-0 pl-0"
            >Change User Information</v-subheader
          >
          <h4 class="mb-3">User-avatar Image</h4>
          <input
            id="imageFileInput"
            type="file"
            label="Upload profile image"
            class="mb-7"
            @change="convertAndPost($event)"
          />
          <v-text-field
            v-model="currentPayload.userprofile.first_name"
            label="First Name - required Field"
          ></v-text-field>
          <v-text-field
            v-model="currentPayload.userprofile.last_name"
            label="Last Name - required Field"
          ></v-text-field>
          <v-text-field
            v-model="currentPayload.password"
            label="Password - required to make changes"
            type="password"
          />

          <v-btn type="submit">Save changes</v-btn>
        </v-form>
      </v-col>
    </v-row>
    <v-alert
      v-if="!authenticated"
      outlined
      type="warning"
      prominent
      border="left"
    >
      Can`t view site, you are not logged in!
      <v-btn to="/login" class="ml-2">Login</v-btn>
    </v-alert>
  </v-container>
</template>
<script>
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      currentPayload: {
        email: '',
        password: '',
        userprofile: {
          image: '',
          first_name: '',
          last_name: '',
        },
      },
      selectedImage: null,
    }
  },
  computed: {
    ...mapState('user', ['user']),
    ...mapState('user', ['userprofile']),
    authenticated() {
      if (localStorage.getItem('token')) return true
      else return false
    },
  },

  created() {
    this.getMyUser()
    this.setIsAuthToTrue()
    this.currentPayload.email = this.user.email
    // for safety, somehow probs with state
    localStorage.setItem('email', this.user.email)
    this.currentPayload.userprofile.first_name = this.userprofile.first_name
    this.currentPayload.userprofile.last_name = this.userprofile.last_name
  },

  methods: {
    ...mapMutations('user', ['edit', 'setIsAuthToTrue']),
    ...mapActions('user', ['getMyUser', 'updateUserProfile']),

    submitForm() {
      if (!this.currentPayload.email) {
        this.currentPayload.email = localStorage.getItem('email')
      }
      if (!this.currentPayload.userprofile.image) {
        this.currentPayload.userprofile.image =
          localStorage.getItem('imageBase64String')
      }
      this.updateUserProfile(this.currentPayload)
      this.$swal.fire({
        icon: 'success',
        title: 'User has been updated!',
        showConfirmButton: false,
        timer: 2400,
      })
      setTimeout(() => {
        location.reload()
      }, 2400)
    },
    isImageFile(file) {
      return file.type.startsWith('image/')
    },
    async postImageToExternalAPI(convertedImage) {
      const APIURL = 'https://api.imgbb.com/1/upload'
      const URLAPIKEY = '?expiration=600&key=9ce3438bbab9147ab4bd78382ed49383'
      const formData = new FormData()

      formData.append('image', convertedImage)

      await this.$axios
        .post(APIURL + URLAPIKEY, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          // console.log(response.data)
          if (response.status === 200) {
            this.currentPayload.userprofile.image = response.data.data.url
          }
        })
    },

    convertToBase64AndPostToAPI(file) {
      const reader = new FileReader()
      let convertedFile = null

      reader.onloadend = () => {
        // strip off mime
        convertedFile = reader.result.split(',')[1]
        // save Base64 String to localStorage for client side use
        localStorage.setItem('imageBase64String', convertedFile)
        this.postImageToExternalAPI(convertedFile)
      }
      reader.readAsDataURL(file)
    },
    convertAndPost(event) {
      const file = event.target.files[0]

      // Check if the selected file is an image
      if (!this.isImageFile(file)) {
        alert('Please select an image file.')
        return
      }
      // Convert the selected image to base64
      this.convertToBase64AndPostToAPI(file)
    },
  },
}
</script>
<style>
.v-file-input__text {
  height: 12px;
}
</style>
