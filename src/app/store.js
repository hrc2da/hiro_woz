import { configureStore } from '@reduxjs/toolkit';
import guiSlice from '../features/gui/GuiSlice';
import robotSlice from '../features/robot/RobotSlice';
import phrasesSlice from '../features/speechWidget/PhrasesSlice';
import gestureSlice from '../features/gestureWidget/GestureSlice';
import projectSlice from '../features/project/ProjectSlice';
// import {loadState,saveState} from './localstorage';


export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('hiro_state');
    if(serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  }
  catch(err){
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    console.log("SAVING STATE");
    const serializedState = JSON.stringify(state);
    localStorage.setItem('hiro_state',serializedState);
  }
  catch(err){
    //do nothing on write errors
  }
}

export const saveLocal = () => {
  saveState({
    gesture: store.getState().gesture,
    project: store.getState().project
  });
}

export const clearLocal = () => {
  localStorage.removeItem('hiro_state');
}



let persistedState = loadState();
let loadedState = Object.assign({},persistedState);

export const store = configureStore({
  reducer: {
    gui: guiSlice.reducer,
    robot: robotSlice.reducer,
    phrases: phrasesSlice.reducer,
    gesture: gestureSlice.reducer,
    project: projectSlice.reducer
  },
  preloadedState: loadedState
});

// store.subscribe(()=>{
//   saveState({
//     gesture: store.getState().gesture,
//     project: store.getState().project
//   });
// });