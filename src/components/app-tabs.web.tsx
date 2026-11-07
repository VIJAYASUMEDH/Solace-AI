
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  background: '#F8F6EF',
  active: '#45634E',
  inactive: '#A0A89E',
  border: '#E9E8DF',
};

export default function AppTabs() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.active,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 76,
          paddingTop: 9,
          paddingBottom: 10,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontFamily: 'DMSansMedium',
          fontSize: 10,
          marginTop: 3,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={22}
              color={focused ? COLORS.active : COLORS.inactive}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="book-outline"
              size={22}
              color={focused ? COLORS.active : COLORS.inactive}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="companion"
        options={{
          title: 'Companion',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={22}
              color={focused ? COLORS.active : COLORS.inactive}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <Ionicons
              name="person-outline"
              size={22}
              color={focused ? COLORS.active : COLORS.inactive}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
