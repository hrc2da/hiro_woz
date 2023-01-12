import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const gestureSlice = createSlice({
    name:  'gesture',
    initialState: {
        'activeGesture': -1,
        'gestures': []
    },
    reducers: {
        setActiveGesture: (state, action) => {
            state.activeGesture = action.payload
        },
        addGesture: (state, action) => {
            state.gestures = [...state.gestures, action.payload]
        }
    }
  });

export default gestureSlice;

export const selectActiveGesture = (state) => state.gesture.activeGesture;
const { setActiveGesture, addGesture } = guiSlice.actions;


export function addNewGesture(gesture) {
    return dispatch => {
      dispatch(addGesture(gesture));
    }
}