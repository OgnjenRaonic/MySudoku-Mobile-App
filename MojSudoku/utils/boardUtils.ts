export const boardToString = (board: string[][]) =>
  board.flat().map(c => c || '.').join('');

export const stringToBoard = (str: string) =>
  Array.from({ length: 9 }, (_, i) =>
    str
      .slice(i * 9, i * 9 + 9)
      .split('')
      .map(c => (c === '.' ? '' : c)),
  );

export const emptyBoard = () =>
  Array(9).fill(0).map(() => Array(9).fill(''));
