<template>
  <v-container>
    <v-row>
      <v-col sm="6" offset-sm="3">
        <h1>TODOs</h1>

        <v-text-field
          v-model="newTask.title"
          name="taskfield"
          label="Enter a task (hit enter-key)"
          @keypress.enter="addTask()"
        ></v-text-field>

        <v-list dense>
          <v-subheader>Tasks</v-subheader>
          <v-list-item-group color="primary">
            <v-list-item v-for="(task, i) in todos" :key="i">
              <template #default="{ active }">
                <v-list-item-action>
                  <v-checkbox :input-value="active"></v-checkbox>
                </v-list-item-action>

                <v-list-item-content>
                  <span
                    v-if="editingTask.id === task.id"
                    class="d-flex justify-space-between align-center"
                  >
                    <v-text-field
                      v-model="editingTask.title"
                      name="name"
                      label="Taskname"
                      append-outer-icon="mdi-check"
                      @click:append-outer="saveEdit()"
                      @keypress.enter="saveEdit()"
                    ></v-text-field>
                    <v-icon @click.stop="cancelEditingTask(i)"
                      >mdi-cancel</v-icon
                    >
                  </span>
                  <span
                    v-else
                    class="d-flex justify-space-between align-center"
                  >
                    {{ task.title }}
                    <span>
                      <v-icon @click.stop="editTask(i)">mdi-pencil</v-icon>
                      <v-icon @click.stop="removeTask(task.id)"
                        >mdi-delete-outline</v-icon
                      >
                    </span>
                  </span>
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
import { mapMutations, mapState, mapActions } from 'vuex'

export default {
  data() {
    return {
      newTask: {
        title: '',
        description: '',
        user: 1,
      },
      editingTask: {},
    }
  },
  computed: {
    ...mapState('todos', ['todos']),
  },
  created() {
    this.getAllTasks()
  },
  methods: {
    ...mapMutations('todos', ['edit', 'toggle']),
    ...mapActions('todos', [
      'getAllTasks',
      'postNewTask',
      'deleteTask',
      'patchTask',
    ]),

    addTask() {
      this.postNewTask(this.newTask)
      this.newTask = ''
      location.reload() // bugfix
    },
    editTask(index) {
      this.editingTask = {
        ...this.todos[index],
      }
    },
    removeTask(taskId) {
      this.deleteTask(taskId)
    },
    cancelEditingTask() {
      this.editingTask = {}
    },
    saveEdit() {
      const taskDataToSave = {
        id: this.editingTask.id,
        taskData: this.editingTask,
      }
      // delete id from taskData
      delete taskDataToSave.taskData.id

      this.patchTask(taskDataToSave)
      this.cancelEditingTask()
      location.reload() // bugfix
    },
  },
}
</script>

<style>
</style>