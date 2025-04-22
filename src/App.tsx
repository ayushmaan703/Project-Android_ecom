import React from 'react';
import {Provider} from 'react-redux';
import {store} from './store/store';
import AppNavigator from './AppNavigator';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{flex: 1}}>
        <AppNavigator />
        <Toast />
      </GestureHandlerRootView>
    </Provider>
  );
}

export default App;
