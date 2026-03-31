import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import MainTabNavigator from './MainTabNavigator';
import TryOnResultScreen from '../screens/TryOnResultScreen';
import AIStudioFeatureScreen from '../screens/AIStudioFeatureScreen';
import WardrobeDetailScreen from '../screens/WardrobeDetailScreen';
import ProductURLScreen from '../screens/ProductURLScreen';
import OnboardingScreen from '../screens/OnboardingScreen';

export type RootStackParamList = {
  Onboarding: undefined;
  MainTabs: undefined;
  TryOnResult: {resultId: string};
  AIStudioFeature: {feature: string};
  WardrobeDetail: {itemId: string};
  ProductURL: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Onboarding"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      <Stack.Screen name="TryOnResult" component={TryOnResultScreen} />
      <Stack.Screen name="AIStudioFeature" component={AIStudioFeatureScreen} />
      <Stack.Screen name="WardrobeDetail" component={WardrobeDetailScreen} />
      <Stack.Screen name="ProductURL" component={ProductURLScreen} />
    </Stack.Navigator>
  );
}
