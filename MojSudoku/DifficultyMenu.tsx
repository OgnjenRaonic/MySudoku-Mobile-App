import React from 'react';
import { View, Button, Text, StyleSheet, TouchableOpacity } from 'react-native';

type Props = {
  onSelectDifficulty: (level: number) => void;
};
const EasyButton = ({ title, onPress }) => (
  <TouchableOpacity
    style={styles.easyButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.ButtonText}>{title}</Text>
  </TouchableOpacity>
);

const MediumButton = ({ title, onPress }) => (
  <TouchableOpacity
    style={styles.mediumButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.ButtonText}>{title}</Text>
  </TouchableOpacity>
);

const HardButton = ({ title, onPress }) => (
  <TouchableOpacity
    style={styles.hardButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.ButtonText}>{title}</Text>
  </TouchableOpacity>
);
const DifficultyMenu: React.FC<Props> = ({ onSelectDifficulty }) => {
  return (
    <View style={styles.menuContainer}>
      <Text style={styles.menuTitle}>Odaberi težinu</Text>
      <EasyButton title="Easy" onPress={() => onSelectDifficulty(1)} />
      <MediumButton title="Medium" onPress={() => onSelectDifficulty(2)} />
      <HardButton title="Hard" onPress={() => onSelectDifficulty(3)} />
    </View>
  );
};

const styles = StyleSheet.create({
  menuContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    margin: 10,
  },
  easyButton: {
    backgroundColor: '#4CAF50',
    padding: 20,
    width: 220,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    margin: 8,
  },
  ButtonText: { color: 'white', fontSize: 30, fontWeight: '600' },
  mediumButton: {
    backgroundColor: 'orange',
    padding: 20,
    width: 220,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    margin: 8,
  },
  hardButton: {
    backgroundColor: 'red',
    padding: 20,
    width: 220,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    margin: 8,
  },
  menuTitle: {
    fontSize: 35,
    fontWeight: 'bold',
    marginBottom: 30,
  },
});

export default DifficultyMenu;
