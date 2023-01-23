export const state = () => ({
    list: [{ text: 'test', done: false }]
})

export const actions = {
}

export const mutations = {
    add(state, text) {
        state.list.push({
            text,
            done: false
        })
    },
    edit(state, taskToEdit) {
        const { index, text } = taskToEdit

        state.list[index].text = text

    },
    remove(state, index) {
        state.list.splice(index, 1)
    },
    toggle(state, todo) {
        todo.done = !todo.done
    }
}