<template>
  <v-container>
    <v-row>
      <v-col sm="6" offset-sm="3">
        <v-tabs fixed-tabs background-color="indigo-light" light>
          <v-tab> by creation-date </v-tab>
          <v-tab> by priority </v-tab>
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
                  :value="3"
                ></v-radio>
                <v-radio
                  :key="2"
                  label="medium prio"
                  color="blue"
                  :value="2"
                ></v-radio>
                <v-radio
                  :key="1"
                  label="high prio"
                  color="red"
                  :value="1"
                ></v-radio>
              </v-radio-group>
            </v-col>
          </v-row>
        </v-container>

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
        priority: 3,
      },
      newTaskFieldActive: false,
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

    setPrio(value) {
      this.newTask.priority = value
    },

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
      location.reload() // bugfix
    },
  },
}
</script>

<style>
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
</style>