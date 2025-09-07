import React from "react";
import { TouchableOpacity, Text, ViewStyle } from "react-native";
import styles from "../styles/sudokuStyles";

type Props = {
  title: string;
  onPress: () => void;
  locked?: boolean;
};

const NumberButton: React.FC<Props> = ({ title, onPress, locked }) => {
  const buttonStyle: ViewStyle = {
    backgroundColor: locked ? "rgba(43, 90, 45, 1)" : "rgba(76, 177, 81, 1)",
    flexDirection: "row",
    padding: 5,
    width: 33,
    height: 50,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    margin: 3,
  };

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.numberText}>{title}</Text>
    </TouchableOpacity>
  );
};

export default NumberButton;
