import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../configs/api";

// fetch all workspaces
export const fetchWorkspaces = createAsyncThunk(
  "workspace/fetchWorkspaces",
  async () => {

    try {

      const { data } = await api.get("/api/workspaces");

      return data.workspaces || [];

    } catch (error) {

      console.log(error?.response?.data?.message || error.message);

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

    setWorkspaces: (state, action) => {
      state.workspaces = action.payload;
    },

    setCurrentWorkspace: (state, action) => {

      localStorage.setItem("currentWorkspaceId", action.payload);

      state.currentWorkspace = state.workspaces.find(
        (w) => w.id === action.payload
      );

    },

    addWorkspace: (state, action) => {

      state.workspaces.push(action.payload);

      state.currentWorkspace = action.payload;

    },

    updateWorkspace: (state, action) => {

      state.workspaces = state.workspaces.map((w) =>
        w.id === action.payload.id ? action.payload : w
      );

      if (state.currentWorkspace?.id === action.payload.id) {

        state.currentWorkspace = action.payload;

      }

    },

    deleteWorkspace: (state, action) => {

      state.workspaces = state.workspaces.filter(
        (w) => w.id !== action.payload
      );

    },

    addProject: (state, action) => {

      state.currentWorkspace.projects.push(action.payload);

      state.workspaces = state.workspaces.map((w) =>
        w.id === state.currentWorkspace.id
          ? {
              ...w,
              projects: w.projects.concat(action.payload),
            }
          : w
      );

    },

    addTask: (state, action) => {

      state.currentWorkspace.projects =
        state.currentWorkspace.projects.map((p) => {

          if (p.id === action.payload.projectId) {

            p.tasks.push(action.payload);

          }

          return p;

        });

    },

    updateTask: (state, action) => {

      state.currentWorkspace.projects =
        state.currentWorkspace.projects.map((p) => {

          if (p.id === action.payload.projectId) {

            p.tasks = p.tasks.map((t) =>
              t.id === action.payload.id ? action.payload : t
            );

          }

          return p;

        });

    },

    deleteTask: (state, action) => {

      state.currentWorkspace.projects =
        state.currentWorkspace.projects.map((p) => {

          if (p.id === action.payload.projectId) {

            p.tasks = p.tasks.filter(
              (t) => !action.payload.taskIds.includes(t.id)
            );

          }

          return p;

        });

    },

  },

  extraReducers: (builder) => {

    builder.addCase(fetchWorkspaces.pending, (state) => {

      state.loading = true;

    });

    builder.addCase(fetchWorkspaces.fulfilled, (state, action) => {

      state.workspaces = action.payload;

      if (action.payload.length > 0) {

        const savedWorkspaceId =
          localStorage.getItem("currentWorkspaceId");

        const foundWorkspace = action.payload.find(
          (w) => w.id === savedWorkspaceId
        );

        state.currentWorkspace =
          foundWorkspace || action.payload[0];

      }

      state.loading = false;

    });

    builder.addCase(fetchWorkspaces.rejected, (state) => {

      state.loading = false;

    });

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