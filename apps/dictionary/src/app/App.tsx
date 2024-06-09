/* eslint-disable jsx-a11y/accessible-emoji */
import React, { } from 'react';
import { MD3DarkTheme as DefaultTheme, PaperProvider } from 'react-native-paper';
import RootLayout from './RootLayout';
import { Provider } from 'react-redux';
import { store } from './state/store';
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
};

export const App = () => {
  return (
    <PaperProvider theme={theme}>
      <Provider store={store}>
        <RootLayout />
      </Provider>
    </PaperProvider>
  );
};



export default App;
