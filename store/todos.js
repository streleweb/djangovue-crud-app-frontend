// BASEURL AXIOS in nuct.config.js
const TODOS = '/todos/'

export const state = () => ({
    todos: [
        { "id": -1, "priority": "", "completed": false, }
    ],
    searchString: ''
})

export const actions = {
    async getAllTasks({ commit }) {
        await this.$axios.get(this.$axios.defaults.baseURL.concat(TODOS),
            { crossdomain: true, headers: { 'Authorization': `Token ${localStorage.getItem('token')}` } }
        ).then((response) => commit('set', response.data))
    },
    async postNewTask({ commit }, taskToPost) {
        await this.$axios.post(this.$axios.defaults.baseURL.concat(TODOS),
            taskToPost, { headers: { 'Authorization': `Token ${localStorage.getItem('token')}` } }
        ).then((response) => commit('add', response.data))
    },
    async patchTaskText({ commit }, taskToPatch) {
        const { id, taskData } = taskToPatch
        await this.$axios.patch(this.$axios.defaults.baseURL.concat(TODOS + id + '/'),
            taskData, { headers: { 'Authorization': `Token ${localStorage.getItem('token')}` } }
        ).then(() => commit('edit', taskData))
    },
    async patchTask({ commit }, taskToPatch) {
        const { id } = taskToPatch
        await this.$axios.patch(this.$axios.defaults.baseURL.concat(TODOS + id + '/'),
            taskToPatch, { headers: { 'Authorization': `Token ${localStorage.getItem('token')}` } }
        ).then(() => commit('editWithId', id, taskToPatch))
    },
    async deleteTask({ commit }, id) {
        await this.$axios.delete(this.$axios.defaults.baseURL.concat(TODOS + id + '/'), { headers: { 'Authorization': `Token ${localStorage.getItem('token')}` } }).then(
            () => commit('remove', id))
    },
    sortTasks({ commit }, sortparam) {
        commit('sort', sortparam)
    },
}

export const mutations = {
    set(state, incomingTasks) {
        state.todos = incomingTasks
    },
    add(state, task) {
        state.todos.push(task)
    },
    edit(state, taskToEdit) {
        const { id, task } = taskToEdit

        const index = state.todos.findIndex(task => {
            return task.id === id
        })
        const updatedTask = {
            ...state.todos[index],
            ...task
        }
        state.todos.splice(index, 1, updatedTask)
    },
    editWithId(state, id, taskToEdit) {
        const taskId = id
        const task = taskToEdit

        const index = state.todos.findIndex(task => {
            return task.id === taskId
        })
        const updatedTask = {
            ...state.todos[index],
            ...task
        }
        state.todos.splice(index, 1, updatedTask)
    },
    remove(state, id) {
        const index = state.todos.findIndex(task => {
            return task.id === id
        })
        state.todos.splice(index, 1)
    },
    toggleTaskCompleted(state, taskId) {
        const task = state.todos.find(t => t.id === taskId);
        task.completed = !task.completed;
    },
    sort(state, sortByField) {
        if (sortByField === "alpha") {
            state.todos.sort((a, b) => {
                const nameA = a.title.toUpperCase();
                const nameB = b.title.toUpperCase();
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            })
        } else if (sortByField === "priority") {
            state.todos.sort((a, b) => {
                if (a.priority === 'lightblue') { a = 3 }
                else if (a.priority === 'yellow') { a = 2 }
                else if (a.priority === 'red') { a = 1 }
                if (b.priority === 'lightblue') { b = 3 }
                else if (b.priority === 'yellow') { b = 2 }
                else if (b.priority === 'red') { b = 1 }
                return a - b
            })
        }
    },
    updateSearchString(state, sString) {
        state.searchString = sString
    }
}

export const getters = {
    getTaskById(state, taskId) {
        return state.todos.find(t => t.id === taskId)
    }
}

