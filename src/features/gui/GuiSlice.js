import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const guiSlice = createSlice({
    name:  'gui',
    initialState: {
        'activeTab': 0,
        'dummy': 5,
        'movementWidth': 640,
        'showEditPanel': false
    },
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload
        },
        setDummy: (state, action) => action.payload,
        setMovementWidth: (state, action) => {
            state.movementWidth = action.payload
        },
        setShowEditPanel: (state, action) => {
            state.showEditPanel = action.payload
        }
    }
  });

export default guiSlice;

export const selectActiveTab = (state) => state.gui.activeTab;
export const selectMovementWidth = (state) => state.gui.movementWidth;
export const selectShowEditPanel = (state) => state.gui.showEditPanel;
const { setActiveTab, setDummy, setShowEditPanel } = guiSlice.actions;
console.log(setDummy(5));

export function updateActiveTab(tab) {
    console.log("dispatching tab update")
    console.log(setActiveTab(tab));
    return dispatch => {
      dispatch(setActiveTab(tab));
    }
}
export function setShowEditPanelState(show) {
    return dispatch => {
      dispatch(setShowEditPanel(show));
    }
}