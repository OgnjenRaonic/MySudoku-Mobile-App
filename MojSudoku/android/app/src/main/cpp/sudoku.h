#pragma once
#include <string>
#include <vector>

using namespace std;

bool solveSudoku(vector<vector<char>>& board);
vector<vector<char>> generateSudoku(int level);
tuple<int, int, std::vector<std::vector<char>>> giveHint(std::vector<std::vector<char>>& board, const std::vector<std::vector<char>>& solvedBoard);
