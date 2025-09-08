#include "sudoku.h"
#include <jni.h>
#include <vector>
#include <string>
#include <cstdlib>
#include <ctime>
#include <algorithm>
#include <random>
#include <stdexcept>
#include <tuple>

using namespace std;

const int SIZE = 9;

// -- Helper funkcije za konverziju --
string boardToString(const vector<vector<char>>& board) {
    string result;
    for (const auto& row : board)
        for (char c : row)
            result += c;
    return result;
}

vector<vector<char>> stringToBoard(const string& s) {
    vector<vector<char>> board(9, vector<char>(9));
    for (int i = 0; i < 81; ++i)
        board[i / 9][i % 9] = s[i];
    return board;
}

bool isValid(vector<vector<char>>& board, int row, int col, char num) {
    for (int i = 0; i < SIZE; ++i) {
        // Red i kolona
        if (board[row][i] == num || board[i][col] == num)
            return false;

        // 3x3 kvadrat
        int boxRow = 3 * (row / 3) + i / 3;
        int boxCol = 3 * (col / 3) + i % 3;
        if (board[boxRow][boxCol] == num)
            return false;
    }
    return true;
}

bool fillBoard(vector<vector<char>>& board) {
    for (int row = 0; row < SIZE; row++) {
        for (int col = 0; col < SIZE; col++) {
            if (board[row][col] == '.') {
                vector<char> numbers = {'1','2','3','4','5','6','7','8','9'};
                shuffle(numbers.begin(), numbers.end(), default_random_engine(rand()));
                for (char num : numbers) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (fillBoard(board))
                            return true;
                        board[row][col] = '.';
                    }
                }
                return false;
            }
        }
    }
    return true;
}
void removeCells(vector<vector<char>>& board, int count = 40) {
    while (count > 0) {
        int row = rand() % 9;
        int col = rand() % 9;
        if (board[row][col] != '.') {
            board[row][col] = '.';
            count--;
        }
    }
}

bool solveSudoku(vector<vector<char>>& board) {
    for (int row = 0; row < 9; row++) {
        for (int col = 0; col < 9; col++) {
            if (board[row][col] == '.') {
                for (char num = '1'; num <= '9'; num++) {
                    if (isValid(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) return true;
                        board[row][col] = '.';
                    }
                }
                return false;
            }
        }
    }
    return true;
};

struct emptyCell {
    int row;
    int col;
    emptyCell(int r, int c) : row(r), col(c) {}
};


tuple<int, int, std::vector<std::vector<char>>> giveHint(std::vector<std::vector<char>>& board, const std::vector<std::vector<char>>& solvedBoard) {
    std::vector<emptyCell> emptyCells;
    for (int row = 0; row < 9; ++row) {
        for (int col = 0; col < 9; ++col) {
            if (board[row][col] == '.') {
                emptyCells.emplace_back(row, col);
            }
        }
    }

    if (emptyCells.empty()) return {-1, -1, board};

    std::random_device rd;
    std::mt19937 gen(rd());
    std::uniform_int_distribution<> distrib(0, static_cast<int>(emptyCells.size()) - 1);

    int idx = distrib(gen);
    const emptyCell& cell = emptyCells[idx];
    board[cell.row][cell.col]=solvedBoard[cell.row][cell.col];
    auto hintedBoard=board;

    return {cell.row, cell.col, hintedBoard};
}


// -- Generator --
vector<vector<char>> generateSudoku(int level) {
    srand(time(nullptr));
    vector<vector<char>> board(9, vector<char>(9, '.'));
    random_device rd;
    mt19937 gen(rd());
    uniform_int_distribution<> distribEasy(36, 46);
    uniform_int_distribution<> distribMedium(56, 61);
    uniform_int_distribution<> distribHard(61, 66); 

    fillBoard(board);
    switch (level)
    {
    case 1:
        removeCells(board, distribEasy(gen));
        break;
    case 2:
        removeCells(board, distribMedium(gen));
        break;
    case 3:
        removeCells(board, distribHard(gen));
        break;
    default:
        break;
    } 

    return board;
}




// -- JNI EXPORT funkcije --
extern "C" JNIEXPORT jstring JNICALL
Java_com_sudokuapp_bridge_SudokuBridgeModule_generateSudokuJNI(JNIEnv* env, jobject, jint level) {
    auto board = generateSudoku(level);
    string result = boardToString(board);
    return env->NewStringUTF(result.c_str());
}

extern "C" JNIEXPORT jstring JNICALL
Java_com_sudokuapp_bridge_SudokuBridgeModule_solveSudokuJNI(JNIEnv* env, jobject, jstring input) {
    const char* nativeString = env->GetStringUTFChars(input, 0);
    string boardStr(nativeString);
    env->ReleaseStringUTFChars(input, nativeString);

    auto board = stringToBoard(boardStr);
    solveSudoku(board);
    string solvedStr = boardToString(board);

    return env->NewStringUTF(solvedStr.c_str());
}

extern "C" JNIEXPORT jstring JNICALL
Java_com_sudokuapp_bridge_SudokuBridgeModule_giveHintJNI(JNIEnv* env, jobject, jstring boardStr, jstring solvedStr) {
    const char* boardChars = env->GetStringUTFChars(boardStr, nullptr);
    const char* solvedChars = env->GetStringUTFChars(solvedStr, nullptr);

    vector<vector<char>> board = stringToBoard(boardChars);
    vector<vector<char>> solved = stringToBoard(solvedChars);

    env->ReleaseStringUTFChars(boardStr, boardChars);
    env->ReleaseStringUTFChars(solvedStr, solvedChars);

    auto [row, col, hintedBoard] = giveHint(board, solved);
    string board_str=boardToString(hintedBoard);

    std::string result = std::to_string(row) + "," + std::to_string(col) + "," + board_str;

    return env->NewStringUTF(result.c_str());
}


