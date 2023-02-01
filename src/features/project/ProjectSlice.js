import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { getProjectList } from '..robot/RobotSlice';

const projectSlice = createSlice({
    name:  'project',
    initialState: {
        'projectName': '',
        'projectList': [],
        'modified': false
    },
    reducers: {
        setProjectName: (state, action) => {
            state.projectName = action.payload
        },
        setProjectList: (state, action) => {
            state.projectList = action.payload
        },
        setModified: (state, action) => {
            state.modified = action.payload
        }
    }
  });

export default projectSlice;

export const selectProjectName = (state) => state.project.projectName;
export const selectProjectList = (state) => state.project.projectList;
export const selectModified = (state) => state.project.modified;
const { setProjectName, setProjectList, setModified } = projectSlice.actions;

export function updateProjectName(name) {
    return  dispatch => {
      dispatch(setProjectName(name));
    }
}

export function updateProjectList(list) {
    return dispatch => {
        dispatch(setProjectList(list));
    }
}

export function updateModified(modified) {
    return dispatch => {
        dispatch(setModified(modified));
    }
}
