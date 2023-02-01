import { configureStore } from '@reduxjs/toolkit';
import guiSlice from '../features/gui/GuiSlice';
import robotSlice from '../features/robot/RobotSlice';
import phrasesSlice from '../features/speechWidget/PhrasesSlice';
import gestureSlice from '../features/gestureWidget/GestureSlice';
import projectSlice from '../features/project/ProjectSlice';

export const store = configureStore({
  reducer: {
    gui: guiSlice.reducer,
    robot: robotSlice.reducer,
    phrases: phrasesSlice.reducer,
    gesture: gestureSlice.reducer,
    project: projectSlice.reducer
  },
});
