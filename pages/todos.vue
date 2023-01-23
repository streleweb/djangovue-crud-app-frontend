<template>
  <v-container>
    <v-row>
      <v-col sm="6" offset-sm="3">
        <h1>TODOs</h1>

        <v-text-field
          v-model="newTask"
          name="taskfield"
          label="Enter a task (hit enter-key)"
          @keypress.enter="addTask"
        ></v-text-field>

        <v-list dense>
          <v-subheader>Tasks</v-subheader>
          <v-list-item-group color="primary">
            <v-list-item v-for="(todo, i) in list" :key="i">
              <template #default="{ active }">
                <v-list-item-action>
                  <v-checkbox :input-value="active"></v-checkbox>
                </v-list-item-action>

                <v-list-item-content>
                    <span v-if ="editingTask.index === i"
                    class="d-flex justify-space-between align-center">
                      <v-text-field
                        v-model="editingTask.text"
                        name="name"
                        label="Taskname"
                        append-outer-icon="mdi-check"
                        @click:append-outer="saveEdit"
                        @keypress.enter="saveEdit"
                      ></v-text-field>
                      <v-icon @click="i;"></v-icon>
                      <v-icon @click.stop="cancelEditingTask(i)">mdi-cancel</v-icon
                      >
                    </v-if></span>
                    <span v-else
                    class="d-flex justify-space-between align-center">
                    {{ todo.text }}
                    <span
                      ><v-icon @click="i;"></v-icon>
                      <v-icon @click.stop="editTask(i)">mdi-pencil</v-icon
                      ><v-icon @click="remove(i)"></v-icon>
                      <v-icon @click.stop="remove(i)"
                        >mdi-delete-outline</v-icon
                      ></span
                    >
                    </span>
                    
                  </v-list-item-subtitle>
                </v-list-item-content>
              </template>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapMutations, mapState } from 'vuex'

export default {
  data() {
    return {
      newTask: '',
      editingTask: {
        index: -1,
        text: '',
      },
    }
  },
  computed: {
    ...mapState('todos', ['list']),
  },
  methods: {
    ...mapMutations('todos', ['add', 'edit', 'remove', 'toggle']),
    addTodo(e) {
      this.$store.commit('todos/add', e.target.value)
      e.target.value = ''
    },
    addTask() {
      this.add(this.newTask)
      this.newTask = ''
    },
    editTask(index) {
      this.editingTask.index = index
      this.editingTask.text = this.list[index].text
    },
    cancelEditingTask() {
      this.editingTask.index = -1
      this.editingTask.text = ''
    },
    saveEdit() {
      this.edit(this.editingTask)
      this.cancelEditingTask()
    },
  },
}
</script>

<style>
</style>
