import { useState } from "react";
import { giveHint } from "../native/SudokuBridge";
import { stringToBoard } from "../utils/boardUtils";

export const useHints = (solvedBoardRef: React.RefObject<string[][]>) => {
  const [hinting, setHinting] = useState(false);

  const handleRandomHint = async (board: string[][]) => {
    if (hinting) return null;
    setHinting(true);
    try {
      const { row, col, hintedBoard } = await giveHint(board, solvedBoardRef.current);
      if (row === -1 || col === -1) return null;
      return { row, col, board: stringToBoard(hintedBoard) };
    } finally {
      setHinting(false);
    }
  };

  const handlePreciseHint = (row: number, col: number) => {
    return solvedBoardRef.current[row][col];
  };

  return { handleRandomHint, handlePreciseHint, hinting };
};
