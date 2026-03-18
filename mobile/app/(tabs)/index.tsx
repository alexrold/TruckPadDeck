import {ThemedText} from '@/components/themed/ThemedText';
import {ThemedView} from '@/components/themed/ThemedView';
import React from 'react';

const HomeScreen = () => {
  return (
    <ThemedView className="mt-20 flex-1 mx-4 ">
      <ThemedText className="font-bold text-xl text-blue-800 ">
        Home Screen
      </ThemedText>
    </ThemedView>
  );
};

export default HomeScreen;
