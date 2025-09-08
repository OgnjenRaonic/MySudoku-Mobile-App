/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { SafeAreaView } from 'react-native';
import SudokuGrid from './SudokuGrid';

const App: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <SudokuGrid />
    </SafeAreaView>
  );
};

export default App;
