import { useRef } from "react";
import {Alert} from "react-native";
import { boardToString, emptyBoard, stringToBoard } from "../utils/boardUtils";

export const useUndo = () => {
  const pastBoards = useRef<string[]>([]);

  const push = (board: string[][]) => {
    pastBoards.current.push(boardToString(board));
  };

  const undo = (): string[][] | null => {
    if (pastBoards.current.length > 1 && boardToString(emptyBoard())!==pastBoards.current[pastBoards.current.length - 2]) {
      pastBoards.current.pop();
      const prev = pastBoards.current[pastBoards.current.length - 1];
      return stringToBoard(prev);
    }
    return null;
  };

  return { push, undo };
};
