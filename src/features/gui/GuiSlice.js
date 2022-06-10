import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const guiSlice = createSlice({
    name:  'gui',
    initialState: {
        'activeTab': 0,
        'dummy': 5
    },
    reducers: {
        setActiveTab: (state, action) => {
            state.activeTab = action.payload
        },
        setDummy: (state, action) => action.payload
    }
  });

export default guiSlice;

export const selectActiveTab = (state) => state.gui.activeTab;
const { setActiveTab, setDummy } = guiSlice.actions;
console.log(setDummy(5));

export function updateActiveTab(tab) {
    console.log("dispatching tab update")
    console.log(setActiveTab(tab));
    return dispatch => {
      dispatch(setActiveTab(tab));
    }
}