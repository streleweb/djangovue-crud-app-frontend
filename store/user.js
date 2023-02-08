// BASEURL AXIOS in nuct.config.js
const REGISTERURL = '/register/'
const LOGINURL = '/login/'
const MANAGEUSERURL = '/myuser/'

export const state = () => ({
    user: {
        "id": Number,
        "email": String,
        "isAuthenticated": false,
    },
})

export const actions = {
    async registerNewUser({ commit }, userData) {
        await this.$axios.post(this.$axios.defaults.baseURL.concat(REGISTERURL),
            userData
        ).then((response) => commit('register', response.data))
    },
    async loginUser({ commit }, userData) {
        await this.$axios.post(this.$axios.defaults.baseURL.concat(LOGINURL),
            userData
        ).then((response) => commit('login', response.data))
    },
    async updateUser({ commit }, userData) {
        const { id, email } = userData
        await this.$axios.patch(this.$axios.defaults.baseURL.concat(MANAGEUSERURL + id + '/'),
            email
        ).then(() => commit('set', userData))
    },
    async deleteUser({ commit }, id) {
        await this.$axios.delete(this.$axios.defaults.baseURL.concat(MANAGEUSERURL + id + '/')).then(
            () => commit('remove', id))
    }
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
            state.user.isAuthenticated = true;
        }
        else state.user.isAuthenticated = false;
    },
    edit(state, userData) {
        state.user = userData
    },
    remove(state) {
        state.user = {}
    },
    toggle(state, todo) {
        todo.done = !todo.done
    }
}

