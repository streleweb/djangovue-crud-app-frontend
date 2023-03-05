// BASEURL AXIOS in nuxt.config.js
const USERSURL = '/users/'
const USERPROFILE = '/userprofile/'
const LOGINURL = '/login/'
const MYUSERURL = '/myuser/'

export const state = () => ({
    user: {
        "id": -1,
        "email": "",
        "isAuthenticated": false,
        "isActive": false,

    },
    userprofile: {
        "first_name": "",
        "last_name": "",
        // "facebook_profile": "",
        // "website": "",
        "image": "",
    },

})

export const actions = {
    // USER ACTIONS
    async registerNewUser({ commit }, userData) {
        await this.$axios.post(this.$axios.defaults.baseURL.concat(USERSURL),
            userData
        ).then((response) => commit('register', response.data))
    },
    async loginUser({ commit }, userData) {
        await this.$axios.post(this.$axios.defaults.baseURL.concat(LOGINURL),
            userData
        ).catch(error => {
            if (error.response) {
                if (error.response.data.non_field_errors) {
                    this.$swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: error.response.data.non_field_errors,
                    })
                }
            }
        }).then((response) => commit('login', response.data))
    },
    async getUserById({ commit }, id) {
        await this.$axios.get(this.$axios.defaults.baseURL.concat(USERSURL + id),
            { crossdomain: true, headers: { 'Authorization': `Token ${localStorage.getItem('token')}` } }
        ).then((response) => commit('set', response.data))
    },
    async getMyUser({ commit }) {
        await this.$axios.get(this.$axios.defaults.baseURL.concat(MYUSERURL),
            { crossdomain: true, headers: { 'Authorization': `Token ${localStorage.getItem('token')}` } }
        ).then((response) => commit('setMyUser', response.data))
    },
    async updateUser({ commit, state }, payload) {
        await this.$axios.put(
            this.$axios.defaults.baseURL.concat(USERSURL + state.user.id + '/'),
            payload,
            {
                crossdomain: true,
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'Application/json',
                },
            }
        ).then(() => commit('setMyUser', payload));
    },
    async updateUserProfile({ commit }, payload) {
        await this.$axios.put(
            this.$axios.defaults.baseURL.concat(MYUSERURL),
            payload,
            {
                crossdomain: true,
                headers: {
                    Authorization: `Token ${localStorage.getItem('token')}`,
                    'Content-Type': 'Application/json',
                },
            }
        ).catch(error => {
            if (error.response) {
                console.log(error.response)
                const errorArray = []
                if (error.response.data.password) errorArray.push('Password: ' + error.response.data.password + '      ')
                if (error.response.data.userprofile.first_name) errorArray.push('First name: ' + error.response.data.userprofile.first_name + '      ')
                if (error.response.data.userprofile.last_name) errorArray.push('Last name: ' + error.response.data.userprofile.last_name + '      ')
                if (error.response.data.userprofile.image) errorArray.push('Image: ' + error.response.data.userprofile.image)
                // console.log(error.response.data)
                // console.log(error.response.status)
                // console.log(error.response.headers)


                this.$swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: errorArray.toString(),

                })
            }

        }).then((response) => {
            commit('setMyUser', payload)

        });
    },


    async deleteUser({ commit }, id) {
        await this.$axios.delete(this.$axios.defaults.baseURL.concat(USERSURL + id + '/')).then(
            () => commit('remove', id))
    },
    // USERPROFILE ACTIONS
    async getUserProfile({ commit }, id) {
        await this.$axios.get(this.$axios.defaults.baseURL.concat(USERSURL + id + USERPROFILE),
            { crossdomain: true, headers: { 'Authorization': `Token ${localStorage.getItem('token')}` } }
        ).then((response) => commit('set', response.data))
    },

}

export const mutations = {
    register(state, userData) {
        if (userData.email.length > 3) {
            state.user = userData
            state.user.registrationSuccessful = true;
        }
        else state.user.registrationSuccessful = false;
    },
    login(state, userData) {
        if (userData.token) {
            localStorage.setItem('token', userData.token)
            state.user = userData
            state.user.id = userData.id
            // for safety
            localStorage.setItem('id', userData.id)
            state.user.isAuthenticated = true;
        }
    },
    set(state, userData) {
        state.user = userData
    },
    setMyUser(state, userData) {
        if (!userData.userprofile.image) {
            userData.userprofile.image = "https://gravatar.com/avatar/b58996c504c5638798eb6b511e6f49af?s=200&d=mp&r=x"
        }

        state.user.id = userData.id
        state.user.email = userData.email

        if (userData) {
            state.user.isAuthenticated = true
        }

        if (userData.userprofile) {
            // console.log(userData.userprofile)
            if (userData.userprofile.first_name) state.userprofile.first_name = userData.userprofile.first_name
            if (userData.userprofile.last_name) state.userprofile.last_name = userData.userprofile.last_name
            if (userData.userprofile.facebook_profile) state.userprofile.facebook_profile = userData.userprofile.facebook_profile
            if (userData.userprofile.website) state.userprofile.website = userData.userprofile.website
            if (userData.userprofile.image) state.userprofile.image = userData.userprofile.image
        }
    },
    setIsAuthToFalse(state) {
        state.user.isAuthenticated = false
    },
    setIsAuthToTrue(state) {
        state.user.isAuthenticated = true
    },
    remove(state) {
        state.user = {}
    },
    updateFirstName(state, firstNamePayload) {
        state.userprofile.first_name = firstNamePayload
    },
    updateLastName(state, lastNamePayload) {
        state.userprofile.last_name = lastNamePayload
    },
    updateImage(state, image) {
        state.userprofile.image = image
    },
}

export const getters = {
    getUser(state) {
        return state.user
    },
    getUserProfile(state) {
        return state.userprofile
    }
}

