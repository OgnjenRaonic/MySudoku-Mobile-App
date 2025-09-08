import { useRef } from "react";
import { boardToString, stringToBoard } from "../utils/boardUtils";

export const useUndo = (initialBoard: string[][]) => {
  const pastBoards = useRef<string[]>([boardToString(initialBoard)]);

  const push = (board: string[][]) => {
    pastBoards.current.push(boardToString(board));
  };

  const undo = (): string[][] | null => {
    if (pastBoards.current.length > 1) {
      pastBoards.current.pop(); // izbaci trenutni
      const prev = pastBoards.current[pastBoards.current.length - 1];
      return stringToBoard(prev);
    }
    return null;
  };

  return { push, undo };
};
