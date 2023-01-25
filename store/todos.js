// BASEURL AXIOS in nuct.config.js
const TODOS = '/todos/'

export const state = () => ({
    todos: [],
    priorityColor: 'red'
})

export const actions = {
    async getAllTasks({ commit }) {
        await this.$axios.get(this.$axios.defaults.baseURL.concat(TODOS),
            { crossdomain: true }
        ).then((response) => commit('set', response.data))
    },
    async postNewTask({ commit }, taskToPost) {
        await this.$axios.post(this.$axios.defaults.baseURL.concat(TODOS),
            taskToPost
        ).then((response) => commit('add', response.data))
    },
    async patchTask({ commit }, taskToPatch) {
        const { id, taskData } = taskToPatch
        await this.$axios.patch(this.$axios.defaults.baseURL.concat(TODOS + id + '/'),
            taskData
        ).then(() => commit('edit', taskData))
    },
    async deleteTask({ commit }, id) {
        await this.$axios.delete(this.$axios.defaults.baseURL.concat(TODOS + id + '/')).then(
            () => commit('remove', id))
    },
    sortTasks({ commit }, sortparam) {
        commit('sort', sortparam)
    }
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
    remove(state, id) {
        const index = state.todos.findIndex(task => {
            return task.id === id
        })
        state.todos.splice(index, 1)
    },
    toggle(state, todo) {
        todo.done = !todo.done
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
            state.todos.sort((a, b) => a.priority - b.priority);
        }
    }
}