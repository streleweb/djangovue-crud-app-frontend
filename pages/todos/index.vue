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
          maxlength="70"
          @input="(event) => (newTaskFieldActive = true)"
          @keypress.enter="addTask()"
        ></v-text-field>
        <v-btn v-if="newTaskFieldActive" @click="addTask()">Save</v-btn>

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
            <v-list-item v-for="(task, i) in visibleTodos" :key="i">
              <template #default="{}">
                <v-list-item-action>
                  <input
                    type="checkbox"
                    style="cursor: pointer"
                    :checked="task.completed"
                    multiple
                    @change="toggleTaskCompletedAndPatchTask(task)"
                  />
                  <!-- <v-checkbox :input-value="active"></v-checkbox> -->
                </v-list-item-action>

                <v-list-item-content>
                  <span
                    v-if="editingTask.id === task.id && isInEditMode"
                    class="d-flex justify-space-between align-center"
                  >
                    <v-text-field
                      v-model="editingTask.title"
                      name="taskinputfield"
                      label="Taskname"
                      append-outer-icon="mdi-check"
                      maxlength="70"
                      @click:append-outer="saveEdit()"
                      @keypress.enter="saveEdit()"
                    ></v-text-field>
                    <v-icon @click.stop="cancelEditingTask(i)"
                      >mdi-cancel</v-icon
                    >
                  </span>
                  <div v-else class="d-flex justify-space-between align-center">
                    <span style="text-align: left">{{ task.title }}</span>
                    <div class="d-flex justify-center align-content-center">
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
                    </div>
                  </div>
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
        user: Number,
        priority: '',
      },
      newTaskFieldActive: false,
      editingTask: {},
      editActive: false,
    }
  },
  computed: {
    ...mapState('todos', ['todos', 'searchString']),
    ...mapState('user', ['user']),
    // ...mapGetters('todos', ['getTaskById']),

    todosempty() {
      if (this.todos.length === 0 && this.user.isAuthenticated) return true
      else return false
    },
    authenticated() {
      return this.user.isAuthenticated
    },
    filteredTodos() {
      return this.todos.filter((todo) =>
        todo.title.toLowerCase().includes(this.searchString.toLowerCase())
      )
    },
    // if nothing is being searched for, show all todos from state
    // else show the filtered ones
    visibleTodos() {
      return this.searchString ? this.filteredTodos : this.todos
    },
    isInEditMode() {
      return this.editActive
    },
  },
  created() {
    this.getMyUser()
    this.getAllTasks()
    this.assignUserIdToNewTask()
  },
  methods: {
    ...mapMutations('todos', ['edit', 'toggleTaskCompleted', 'sort']),
    ...mapActions('todos', [
      'getAllTasks',
      'postNewTask',
      'deleteTask',
      'patchTask',
      'patchTaskText',
    ]),
    ...mapActions('user', ['getMyUser']),
    assignUserIdToNewTask() {
      if (!this.user.id === 1) this.newTask.user = this.user.id
      else if (localStorage.getItem('id'))
        this.newTask.user = localStorage.getItem('id')
    },
    toggleTaskCompletedAndPatchTask(task) {
      this.toggleTaskCompleted(task.id)
      const taskFromState = this.todos.find((t) => t.id === task.id)
      this.patchTask(taskFromState)
    },
    addTask() {
      this.newTask.title = this.sanitizeInput(this.newTask.title)
      this.postNewTask(this.newTask)
      this.newTask.title = ''
      this.newTaskFieldActive = false
    },
    editTask(index) {
      this.editingTask = {
        ...this.todos[index],
      }
      this.editActive = true
    },
    removeTask(taskId) {
      this.deleteTask(taskId)
      this.editActive = false
    },
    cancelEditingTask() {
      this.editingTask = {}
      this.editActive = false
    },
    sanitizeInput(inputString) {
      return this.$sanitizeString(inputString)
    },
    saveEdit() {
      this.editingTask.title = this.sanitizeInput(this.editingTask.title)
      const taskDataToSave = {
        id: this.editingTask.id,
        taskData: this.editingTask,
      }

      this.patchTaskText(taskDataToSave)
      this.editActive = false
      setTimeout(() => {
        location.reload()
      }, 1500)
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