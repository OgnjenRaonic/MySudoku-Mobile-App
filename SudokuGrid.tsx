import React, { useState, useRef } from 'react';
import { generateSudoku, solveSudoku, giveHint } from './native/SudokuBridge';
import DifficultyMenu from './DifficultyMenu';
import { stringToBoard, boardToString, emptyBoard } from "./utils/boardUtils";
import {useHints} from "./hooks/useHints";
import {useUndo} from "./hooks/useUndo";
import NumberButton from './components/NumberButton';
import styles from "./styles/sudokuStyles";
import {
  View,
  TextInput,
  Alert,
  Text,
  Image,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  Pressable,
  ViewStyle,
  GestureResponderEvent,
  Animated
} from 'react-native';

const difficultyLabels = ['Nothing', 'Easy', 'Medium', 'Hard'];
const difficultyColors = ['white', '#4CAF50', 'orange', 'red'];

const SudokuGrid: React.FC = () => {
  const [board, setBoard] = useState<string[][]>(emptyBoard());
  const [isValid, setIsValid] = useState(false);
  const [errorCells, setErrorCells] = useState<Set<string>>(new Set());
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [countedNumbers, setCountNumbers] = useState<{
    [key: string]: number;
  } | null>(null);
  const [lockedNumberButtons, setLockedNumberButtons]= useState<{[key:string]:boolean} | null>(null);
  const [cellsInLine, setCellsInLine] = useState<{
    row: { row: number; col: number }[];
    col: { row: number; col: number }[];
    square: { row: number; col: number }[];
  } | null>(null);
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const startBoard = useRef<string[][]>(emptyBoard());
  const currentBoard = useRef<string[][]>(emptyBoard());
  const solvedBoard = useRef<string[][]>(emptyBoard());
  const pastBoards =useRef<string[]> ([boardToString(startBoard.current)]);
  const [direction, setDirection] = useState(true);
  const [hintButtonsVisible, setHintButtonsVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(1)).current;
  const { push: pushBoard, undo: undoBoard } = useUndo();
  const { handleRandomHint, handlePreciseHint, hinting } = useHints(solvedBoard);

  const translateRandHintX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [direction ? 0 : 0, direction ? 100 : 100],
  });
   const translateIconHintX = slideAnim.interpolate({
    inputRange: [-0.25, 1],
    outputRange: [direction ? 0 : 0, direction ? 100 : 100],
  });


  const startGame = async (level: number) => {
    setDifficulty(level);
    try {
      const boardString = await generateSudoku(level);
      const generatedBoard = stringToBoard(boardString);
      const startCell = { row: 4, col: 4 };
      setSelectedCell(startCell);
      // toggleHintPosition();

      pastBoards.current.push(boardString);
      startBoard.current = generatedBoard;
      currentBoard.current = generatedBoard;

      const solvedBoardStr = await solveSudoku(boardToString(generatedBoard));
      solvedBoard.current = stringToBoard(solvedBoardStr);
      countNumbers();
      allNumberButtonsUnlocked();
      pushBoard(generatedBoard)

      setBoard(generatedBoard);
    } catch (e) {
      console.error('Greška pri generisanju/ucičavanju table:', e);
      Alert.alert('Greška pri generisanju table.');
    }
  };


  const allNumberButtonsUnlocked =() =>{
    setLockedNumberButtons(prev => {
  if (!prev) return null;

  const allFalse = Object.fromEntries(
    Object.keys(prev).map(key => [key, false])
  );

  return allFalse;
});
  }

  const highlightRelatedCells = (selected: { row: number; col: number }) => {
    const { row, col } = selected;

    const rowCoords = Array.from({ length: 9 }, (_, c) => ({ row, col: c }));

    const colCoords = Array.from({ length: 9 }, (_, r) => ({ row: r, col }));

    const squareCoords: { row: number; col: number }[] = [];
    const squareRowStart = Math.floor(row / 3) * 3;
    const squareColStart = Math.floor(col / 3) * 3;
    for (let r = squareRowStart; r < squareRowStart + 3; r++) {
      for (let c = squareColStart; c < squareColStart + 3; c++) {
        squareCoords.push({ row: r, col: c });
      }
    }

    setCellsInLine({
      row: rowCoords,
      col: colCoords,
      square: squareCoords,
    });
  };

  const handleChange = (row: number, col: number, val: string) => {
    if (startBoard.current[row][col] != '' || cellCheck(row, col)) return null;
    if ((val === '' || /^[1-9]$/.test(val))) {
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = val;
      currentBoard.current = newBoard;
      if (handleCheck(row, col)) {
        setCountNumbers(prev => {
          const currentCount = prev?.[val] ?? 0;
          const newCount = currentCount + 1;
           if (newCount === 9) lockNumberWhenFinished(val);
           return {
            ...(prev ?? {}),
            [val]: newCount,
            };
        });
      }
      console.log("Uspesno promenjeno polje");
      pushBoard(newBoard);
      setBoard(newBoard);
    }
  };

  const handleDifficulty = () => {
    setDifficulty(null);
  };
  
  const lockNumberWhenFinished = (val: string) => {
        setLockedNumberButtons(prev => ({
          ...prev,
          [val]: true,
        }));
  };

  
  const countNumbers = () => {
    let ones, twos, threes, fours, fives, sixes, sevens, eights, nines;
    ones = twos = threes = fours = fives = sixes = sevens = eights = nines = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        switch (currentBoard.current[row][col]) {
          case '1':
            ones++;
            break;
            case '2':
              twos++;
              break;
              case '3':
                threes++;
                break;
                case '4':
                  fours++;
                  break;
                  case '5':
                    fives++;
                    break;
                    case '6':
                      sixes++;
                      break;
                      case '7':
                        sevens++;
                        break;
                        case '8':
                          eights++;
                          break;
                          case '9':
                            nines++;
                            break;
                            default:
                              break;
                            }
                          }
                        }
                        const counted = {
                          1: ones,
                          2: twos,
                          3: threes,
                          4: fours,
                          5: fives,
                          6: sixes,
                          7: sevens,
                          8: eights,
                          9: nines,
                        };
    setCountNumbers(counted);
  };
                      
  const cellCheck = (row: number, col: number) => {
    return currentBoard.current[row][col] === solvedBoard.current[row][col];
  };

  const handleUndo = () => {
    const prevBoard = undoBoard();
    if (prevBoard) {
      currentBoard.current = prevBoard;
      setBoard(prevBoard);
    }
  }
  
  const handleCheck = (row: number, col: number) => {
    const val = currentBoard.current[row][col];
    const correct = solvedBoard.current[row][col];
    const isStart = startBoard.current[row][col] !== '';
    setErrorCells(prev => {
      const newErrors = new Set(prev ?? []);
      const cellKey = `${row}-${col}`;
      if (!isStart && val !== '' && val !== correct) {
        newErrors.add(cellKey);
      } else {
        newErrors.delete(cellKey);
      }
      
      setIsValid(newErrors.size === 0);
      return newErrors;
    });
    
    return val === correct || isStart || val === '';
  };
  
    const handleReset = () => {
      currentBoard.current = startBoard.current;
      countNumbers();
      setErrorCells(new Set(null));
      allNumberButtonsUnlocked();
      setBoard(startBoard.current);
    };

  const handleSolve = () => {
    setBoard(solvedBoard.current);
  };
  const onRandomHintPress = async () => {
  const result = await handleRandomHint(currentBoard.current);
  if (result) {
    const { row, col, board } = result;
    currentBoard.current = board;
    const val=solvedBoard.current[row][col];
    setBoard(board);
    setCountNumbers(prev => {
          const currentCount = prev?.[val] ?? 0;
          const newCount = currentCount + 1;
           if (newCount === 9) lockNumberWhenFinished(val);
           return {
            ...(prev ?? {}),
            [val]: newCount,
            };
        });
  }
};

  const onPreciseHintPress = () => {
  if (selectedCell) {
    const value = handlePreciseHint(selectedCell.row, selectedCell.col);
    const newBoard = currentBoard.current.map((r) => [...r]);
    newBoard[selectedCell.row][selectedCell.col] = value;
    currentBoard.current = newBoard;
    setBoard(newBoard);
  }
};

  const handleDelete = () => {
      if (selectedCell?.row != null && selectedCell?.col != null) {
        handleChange(selectedCell.row, selectedCell.col, '');
      }
  }

  const handleNew = async () => {
    try {
      const boardString = await generateSudoku(difficulty || 1);
      const generatedBoard = stringToBoard(boardString);

      startBoard.current = generatedBoard;
      currentBoard.current = generatedBoard;

      const solvedBoardStr = await solveSudoku(boardToString(generatedBoard));
      solvedBoard.current = stringToBoard(solvedBoardStr);
      countNumbers();
      setBoard(generatedBoard);
      setErrorCells(new Set(null));
      allNumberButtonsUnlocked();
    } catch (e) {
      console.error('Greška pri generisanju nove table:', e);
    }
  };

  //Otkriva ili sakriva hint dugmice,a ako se ne pritisne za sakrivanje nakon 5 sec ih sakriva
  const toggleHintPosition = () => {
    const opening = !hintButtonsVisible; 
    setHintButtonsVisible(opening);
    setDirection(opening);

    Animated.timing(slideAnim, {
      toValue: opening ? 1 : 0,
      useNativeDriver: true,
    }).start();

    if (!opening) {
      setTimeout(() => {
        setHintButtonsVisible(true);
        setDirection(true);
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      }, 5000);
    }
  };


  const getCellBackground = (row: number, col: number) => {
    const isSelected = selectedCell?.row === row && selectedCell?.col === col;

    const isInLine =
      cellsInLine &&
      (cellsInLine.row.some(cell => cell.row === row && cell.col === col) ||
        cellsInLine.col.some(cell => cell.row === row && cell.col === col) ||
        cellsInLine.square.some(cell => cell.row === row && cell.col === col));

    if (isSelected) return 'rgb(129, 186, 220)';
    if (errorCells.has(`${row}-${col}`)) return 'rgba(240, 162, 162, 1)';
    if (
      isInLine &&
      selectedCell !== null &&
      currentBoard.current[selectedCell.row][selectedCell.col] === ''
    ) {
      return 'rgb(186, 216, 234)';
    }
    if (startBoard.current[row][col] !== '') return 'rgb(222, 222, 222)';
    return 'rgb(255, 255, 255)';
  };

  const getCellStyle = (row: number, col: number): TextStyle => ({
    width: 40,
    height: 41,
    textAlign: 'center',
    fontSize: 17,
    borderColor: 'black',
    borderLeftWidth: col % 3 === 0 ? 3 : 1,
    borderTopWidth: row % 3 === 0 ? 3 : 1,
    borderRightWidth: col === 8 ? 3 : 1,
    borderBottomWidth: row === 8 ? 3 : 1,
    color: errorCells.has(`${row}-${col}`)
      ? 'rgb(241, 82, 82)'
      : 'rgb(0, 0, 0)',
    backgroundColor: getCellBackground(row, col),
    fontWeight: startBoard.current[row][col] !== '' ? '900' : '600',
  });

  if (difficulty === null) {
    return <DifficultyMenu onSelectDifficulty={startGame} />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleDifficulty}
        style={styles.iconDiffButton}
      >
        <View style={styles.containerDiff} />
        <View style={styles.containerDiffLight} />
        <Text style={styles.diffButtonText}>Promeni težinu</Text>
      </TouchableOpacity>
      <View style={styles.iconButtons}>
         {/* Delete dugme */}
         <TouchableOpacity
          onPress={handleDelete}
          style={styles.iconDeleteButton}
        >
          <Image
            source={require('./assets/eraser.png')}
            style={styles.image}
            resizeMode="contain"
          />
        {/* Undo dugme */}
        </TouchableOpacity>
         <TouchableOpacity
          onPress={handleUndo}
          style={styles.iconDeleteButton}
        >
          <Image
            source={require('./assets/undo.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.diffText,
            {
              color:
                difficulty !== null ? difficultyColors[difficulty] : 'white',
            },
          ]}
        >
          {difficulty !== null ? difficultyLabels[difficulty] : ''}
        </Text>
      <View style={styles.hintWrapper}>
    {/* Hint dugme koje se pomera ulevo */}
    <Animated.View
      style={[
        styles.hintIconContainer,
        { transform: [{ translateX: translateIconHintX }] },
      ]}
    >
      <TouchableOpacity
        onPress={toggleHintPosition}
        style={styles.iconHintButton}
      >
        <Image
          source={require('./assets/questionmark.png')}
          style={styles.imageHint}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animated.View>

    {/* Dodatna dva dugmeta koja se pojavljuju desno */}
    <Animated.View
      style={[
        styles.hintButtonsContainer,
        {
          transform: [{ translateX: translateRandHintX}],
        },
      ]}
    >
      <TouchableOpacity onPress={onRandomHintPress} style={styles.iconHintButton}>
        <View style={styles.containerHint} />
        <View style={styles.containerHintLight} />
        <Text style={styles.hintText}>Hint</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onPreciseHintPress} style={styles.iconHintButton}>
        <View style={styles.containerHint} />
        <View style={styles.containerHintLight} />
        <Text style={styles.hintText}>Super hint</Text>
      </TouchableOpacity>
    </Animated.View>
  </View>
</View>
      <View style={styles.grid}>
        {board.map((row, rIdx) => (
          <View key={`row-${rIdx}`} style={styles.row}>
            {row.map((cell, cIdx) => (
              <Pressable
                key={`cell-${rIdx}-${cIdx}`}
                onPress={() => {
                  const cellPosition = { row: rIdx, col: cIdx };
                  setSelectedCell(cellPosition);
                  highlightRelatedCells(cellPosition);
                }}
                style={styles.cellWrapper}
              >
                <TextInput
                  style={getCellStyle(rIdx, cIdx)}
                  value={cell.toString()}
                  editable={false}
                  caretHidden={true}
                  pointerEvents="none"
                />
              </Pressable>
            ))}
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={handleNew} style={styles.iconPlusButton}>
        <View style={styles.containerPlus} />
        <View style={styles.containerPlusLight} />
        <Text style={styles.plusText}>Nova tabla</Text>
        <Image
          source={require('./assets/plus.png')}
          style={styles.imagePlus}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <View style={styles.numberButtons}>
        {selectedCell && (
          <View style={styles.numberButtons}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <View key={num} style={styles.buttonWrapper}>
                <NumberButton
                  title={num.toString()}
                  onPress={() =>
                    handleChange(
                      selectedCell.row,
                      selectedCell.col,
                      num.toString(),
                    )
                  }
                  locked={!!lockedNumberButtons?.[num]}
                />
                {countedNumbers && countedNumbers[num] < 9 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {9 - countedNumbers[num]}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};


export default SudokuGrid;
