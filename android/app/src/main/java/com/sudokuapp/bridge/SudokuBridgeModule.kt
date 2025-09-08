package com.sudokuapp.bridge

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.bridge.ReadableArray


class SudokuBridgeModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    companion object {
        init {
            System.loadLibrary("sudoku") // ime tvoje .so biblioteke (libsudoku.so)
        }

        @JvmStatic external fun generateSudokuJNI(level: Int): String
        @JvmStatic external fun solveSudokuJNI(input: String): String
        @JvmStatic external fun isValidSudokuJNI(input: String): Boolean
        @JvmStatic external fun giveHintJNI(board: String, solved: String): String
    }

    override fun getName(): String = "SudokuBridge"

    @ReactMethod
    fun generateSudoku(level: Int, promise: Promise) {
    try {
        val result = generateSudokuJNI(level)
        promise.resolve(result)
    } catch (e: Exception) {
        promise.reject("GENERATION_ERROR", e)
    }
    }

    @ReactMethod
    fun solveSudoku(input: String, promise: Promise) {
        try {
            val result = solveSudokuJNI(input)
            promise.resolve(result)
        } catch (e: Exception) {
            promise.reject("SOLVE_ERROR", e)
        }
    }
    private fun arrayToFlatString(array: ReadableArray): String {
    val sb = StringBuilder()

    for (i in 0 until array.size()) {
        val row = array.getArray(i)
        for (j in 0 until row!!.size()) {
            val cell = row.getString(j)
            sb.append(if (cell.isNullOrEmpty()) '.' else cell)
        }
    }

    return sb.toString()
}

     @ReactMethod
fun giveHint(boardArray: ReadableArray, solvedArray: ReadableArray, promise: Promise) {
    try {
        val boardStr = arrayToFlatString(boardArray)
        val solvedStr = arrayToFlatString(solvedArray)
        val result = giveHintJNI(boardStr, solvedStr)
        val parts = result.split(",", limit = 3)

        if (parts.size == 3) {
            val row = parts[0].toInt()
            val col = parts[1].toInt()
            val board = parts[2]

            val map = WritableNativeMap().apply {
                putInt("row", row)
                putInt("col", col)
                putString("hintedBoard", board)
            }

            promise.resolve(map)
        } else {
            promise.reject("INVALID_RESULT", "Unexpected format: $result")
        }

    } catch (e: Exception) {
        promise.reject("JNI_ERROR", e)
    }
}

}
