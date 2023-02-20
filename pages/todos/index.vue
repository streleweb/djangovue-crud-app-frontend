<template>
  <v-container>
    <v-row v-if="authenticated">
      <v-col sm="6" offset-sm="3">
        <v-tabs fixed-tabs background-color="indigo-light" light>
          <v-tab @click="sort('alpha')"> alphabetically </v-tab>
          <v-tab @click="sort('priority')"> by priority </v-tab>
        </v-tabs>
        <div class="topmargin"></div>
        <v-text-field
          v-model="newTask.title"
          name="taskfield"
          label="Enter a task (hit enter-key)"
          @input="(event) => (newTaskFieldActive = true)"
          @keypress.enter="addTask()"
        ></v-text-field>

        <v-container v-if="newTaskFieldActive" fluid>
          <v-row>
            <v-col cols="12" class="minimize">
              <v-radio-group v-model="newTask.priority" row>
                <v-radio
                  :key="3"
                  label="low prio"
                  color="gray"
                  value="lightblue"
                ></v-radio>
                <v-radio
                  :key="2"
                  label="medium prio"
                  color="yellow"
                  value="yellow"
                ></v-radio>
                <v-radio
                  :key="1"
                  label="high prio"
                  color="red"
                  value="red"
                ></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>

        <v-alert
          v-if="todosempty"
          outlined
          type="warning"
          prominent
          border="left"
        >
          There are currently no tasks in the database!
        </v-alert>
        <v-list v-else dense>
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
                      <v-icon title="edit task" @click.stop="editTask(i)"
                        >mdi-pencil</v-icon
                      >
                      <v-icon
                        title="remove task"
                        @click.stop="removeTask(task.id)"
                        >mdi-delete-outline</v-icon
                      >
                      <v-chip
                        class="ma-2"
                        :style="{
                          backgroundColor: task.priority,
                          opacity: 0.7,
                        }"
                        style="height: 1.5rem"
                        title="priority"
                        text-color="white"
                      />
                    </span>
                  </span>
                </v-list-item-content>
              </template>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-col>
    </v-row>
    <v-alert
      v-if="!authenticated"
      outlined
      type="warning"
      prominent
      border="left"
    >
      Can`t view tasks, you are not logged in!
      <v-btn to="/login" class="ml-2">Login</v-btn>
    </v-alert>
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
        priority: '',
      },
      newTaskFieldActive: false,
      editingTask: {},
    }
  },
  computed: {
    ...mapState('todos', ['todos']),
    ...mapState('user', ['user']),
    todosempty() {
      if (this.todos.length === 0 && this.user.isAuthenticated) return true
      else return false
    },
    authenticated() {
      if (localStorage.getItem('token')) return true
      else return false
    },
  },
  created() {
    this.getAllTasks()
  },
  methods: {
    ...mapMutations('todos', ['edit', 'toggle', 'sort']),
    ...mapActions('todos', [
      'getAllTasks',
      'postNewTask',
      'deleteTask',
      'patchTask',
    ]),
    addTask() {
      this.postNewTask(this.newTask)
      this.newTask.title = ''
      this.newTaskFieldActive = false
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
      location.reload() // fix later
    },
  },
}
</script>

<style>
::selection {
  color: blue;
}

.topmargin {
  margin-top: 3rem;
}

.minimize {
  margin-bottom: 0;
  padding: 0;
  height: 60px;
  display: flex;
  justify-content: center;
}

#prioritySquare {
  height: 10px;
  width: 10px;
  display: block;
}
</style>