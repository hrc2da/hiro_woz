import { configureStore } from '@reduxjs/toolkit';
import guiSlice from '../features/gui/GuiSlice';
import robotSlice from '../features/robot/RobotSlice';
import phrasesSlice from '../features/speechWidget/PhrasesSlice';

export const store = configureStore({
  reducer: {
    gui: guiSlice.reducer,
    robot: robotSlice.reducer,
    phrases: phrasesSlice.reducer
  },
});
