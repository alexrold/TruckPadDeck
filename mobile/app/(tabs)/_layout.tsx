import {Tabs} from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,      // Oculta el Header por defecto
        tabBarStyle: { display: 'none' }, // Oculta la barra de pestañas (Tabs)
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
        }}
      />
    </Tabs>
  );
}
