// native/SudokuBridge.ts

import { NativeModules } from 'react-native';

const { SudokuBridge } = NativeModules;

export const generateSudoku = async (level: number): Promise<string> => {
  if (!SudokuBridge?.generateSudoku) {
    throw new Error('SudokuBridge.generateSudoku is not defined.');
  }
  return await SudokuBridge.generateSudoku(level);
};

export const solveSudoku = async (board: string): Promise<string> => {
  if (!SudokuBridge?.solveSudoku) {
    throw new Error('SudokuBridge.solveSudoku is not defined.');
  }
  return await SudokuBridge.solveSudoku(board);
};

export const isValidSudoku = async (input: string): Promise<boolean> => {
  if (!SudokuBridge?.isValidSudoku) {
    throw new Error('SudokuBridge.isValidSudoku is not defined.');
  }
  return await SudokuBridge.isValidSudoku(input);
};

export const giveHint = async (
  board: string[][],
  solved: string[][],
): Promise<{ row: number; col: number; hintedBoard:string }> => {
  if (!SudokuBridge?.giveHint) {
    throw new Error('SudokuBridge.giveHint is not defined.');
  }
  return await SudokuBridge.giveHint(board, solved);
};
