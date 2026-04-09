import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../configs/api";

/* FETCH WORKSPACES WITH CLERK TOKEN */
export const fetchWorkspaces = createAsyncThunk(
  "workspace/fetchWorkspaces",
  async ({ getToken }) => {

    try {

      const token = await getToken();

      const { data } = await api.get("/api/workspaces", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data.workspaces || [];

    } catch (error) {

      console.log(
        error?.response?.data?.message || error.message
      );

      return [];

    }

  }
);

const initialState = {
  workspaces: [],
  currentWorkspace: null,
  loading: false,
};

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,

  reducers: {

    /* SET WORKSPACES */
    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },

    /* SELECT WORKSPACE */
    setCurrentWorkspace: (state, action) => {

      localStorage.setItem(
        "currentWorkspaceId",
        action.payload
      );

      state.currentWorkspace =
        state.workspaces.find(
          (w) =>
            String(w.id) === String(action.payload)
        ) || null;

    },

    /* ADD WORKSPACE */
    addWorkspace: (state, action) => {

      state.workspaces.push(action.payload);

      state.currentWorkspace = action.payload;

      localStorage.setItem(
        "currentWorkspaceId",
        action.payload.id
      );

    },

    /* UPDATE WORKSPACE */
    updateWorkspace: (state, action) => {

      state.workspaces = state.workspaces.map((w) =>
        w.id === action.payload.id
          ? action.payload
          : w
      );

      if (
        state.currentWorkspace?.id ===
        action.payload.id
      ) {

        state.currentWorkspace = action.payload;

      }

    },

    /* DELETE WORKSPACE */
    deleteWorkspace: (state, action) => {

      state.workspaces =
        state.workspaces.filter(
          (w) => w.id !== action.payload
        );

      if (
        state.currentWorkspace?.id ===
        action.payload
      ) {

        state.currentWorkspace = null;

        localStorage.removeItem(
          "currentWorkspaceId"
        );

      }

    },

    /* ADD PROJECT */
    addProject: (state, action) => {

      if (!state.currentWorkspace) return;

      state.currentWorkspace.projects =
        state.currentWorkspace.projects || [];

      state.currentWorkspace.projects.push(
        action.payload
      );

    },

    /* ADD TASK */
    addTask: (state, action) => {

      if (!state.currentWorkspace) return;

      state.currentWorkspace.projects =
        state.currentWorkspace.projects.map(
          (project) => {

            if (
              project.id ===
              action.payload.projectId
            ) {

              project.tasks =
                project.tasks || [];

              project.tasks.push(action.payload);

            }

            return project;

          }
        );

    },

    /* UPDATE TASK */
    updateTask: (state, action) => {

      if (!state.currentWorkspace) return;

      state.currentWorkspace.projects =
        state.currentWorkspace.projects.map(
          (project) => {

            if (
              project.id ===
              action.payload.projectId
            ) {

              project.tasks =
                project.tasks.map((task) =>
                  task.id === action.payload.id
                    ? action.payload
                    : task
                );

            }

            return project;

          }
        );

    },

    /* DELETE TASK */
    deleteTask: (state, action) => {

      if (!state.currentWorkspace) return;

      state.currentWorkspace.projects =
        state.currentWorkspace.projects.map(
          (project) => {

            if (
              project.id ===
              action.payload.projectId
            ) {

              project.tasks =
                project.tasks.filter(
                  (task) =>
                    !action.payload.taskIds.includes(
                      task.id
                    )
                );

            }

            return project;

          }
        );

    },

  },

  extraReducers: (builder) => {

    builder.addCase(
      fetchWorkspaces.pending,
      (state) => {

        state.loading = true;

      }
    );

    builder.addCase(
      fetchWorkspaces.fulfilled,
      (state, action) => {

        state.workspaces = action.payload;

        if (action.payload.length > 0) {

          const savedWorkspaceId =
            localStorage.getItem(
              "currentWorkspaceId"
            );

          if (savedWorkspaceId) {

            const foundWorkspace =
              action.payload.find(
                (workspace) =>
                  String(workspace.id) ===
                  String(savedWorkspaceId)
              );

            state.currentWorkspace =
              foundWorkspace ||
              action.payload[0];

          } else {

            state.currentWorkspace =
              action.payload[0];

            localStorage.setItem(
              "currentWorkspaceId",
              action.payload[0].id
            );

          }

        }

        state.loading = false;

      }
    );

    builder.addCase(
      fetchWorkspaces.rejected,
      (state) => {

        state.loading = false;

      }
    );

  },

});

export const {
  setWorkspaces,
  setCurrentWorkspace,
  addWorkspace,
  updateWorkspace,
  deleteWorkspace,
  addProject,
  addTask,
  updateTask,
  deleteTask,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;