import {ThemedText, ThemedView} from '@/components/themed';
import React from 'react';

const HomeScreen = () => {
  return (
    <ThemedView className="mt-20 flex-1 mx-4 ">
      <ThemedText className="font-bold text-xl">Home Screen</ThemedText>
    </ThemedView>
  );
};
export default HomeScreen;
