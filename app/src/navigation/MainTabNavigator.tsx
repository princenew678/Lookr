import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {COLORS, FONTS} from '../utils/theme';
import TryOnScreen from '../screens/TryOnScreen';
import WardrobeScreen from '../screens/WardrobeScreen';
import AIStudioScreen from '../screens/AIStudioScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabIcon = ({label, emoji, focused}: {label: string; emoji: string; focused: boolean}) => (
  <View style={styles.tabItem}>
    <Text style={[styles.tabEmoji, focused && styles.tabEmojiActive]}>{emoji}</Text>
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
  </View>
);

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}>
      <Tab.Screen
        name="TryOn"
        component={TryOnScreen}
        options={{
          tabBarIcon: ({focused}) => <TabIcon label="Try On" emoji="✨" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Wardrobe"
        component={WardrobeScreen}
        options={{
          tabBarIcon: ({focused}) => <TabIcon label="Wardrobe" emoji="👗" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Studio"
        component={AIStudioScreen}
        options={{
          tabBarIcon: ({focused}) => <TabIcon label="Studio" emoji="🎨" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{
          tabBarIcon: ({focused}) => <TabIcon label="History" emoji="🕐" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({focused}) => <TabIcon label="Profile" emoji="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.surface,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    height: Platform.OS === 'ios' ? 85 : 65,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
  },
  tabItem: {
    alignItems: 'center',
    gap: 3,
  },
  tabEmoji: {
    fontSize: 22,
    opacity: 0.5,
  },
  tabEmojiActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textMuted,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: COLORS.accent,
  },
});
