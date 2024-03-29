import * as React from 'react';
import { createRoot } from 'react-dom/client';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme';
import { Provider } from 'react-redux';
import { store } from './app/store';
// import reportWebVitals from './reportWebVitals';
import {setupRosBridge} from './features/robot/rosbridge';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
// setupRosBridge('ws://192.168.1.81',store.dispatch);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
  
);
