import React, {useEffect} from 'react';
import {StatusBar, LogBox} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './navigation/RootNavigator';
import {toastConfig} from './components/ToastConfig';
import {useAppStore} from './store/appStore';

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

export default function App() {
  const initStore = useAppStore(s => s.init);

  useEffect(() => {
    initStore();
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#0a0a0f" />
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
        <Toast config={toastConfig} />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
