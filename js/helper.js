// Save TrainingMode & Language Preference
function getTrainingModeFromLocal() {
    return localStorage.getItem("lastTrainingMode") || null;
}

function storeTrainingMode(mode) {
    localStorage.setItem("lastTrainingMode", mode);
}

function getLanguageSetFromLocal() {
    return localStorage.getItem("preferLanguage") || null;
}

function storeLanguagePreference(lan) {
    localStorage.setItem("preferLanguage", lan);
}

// 辅助函数, 判断两个数在整除一个数之后结果是否相等
function inSameRange(a, b, range) {
    return Math.floor(a / range) === Math.floor(b / range);
}

// Alphabet
const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

// Maple Feng
const ffLetters = [
    'A', 'B', 'C', 'D', 'K', 'F', 'G', 'H', 'J',
    'W', 'M', 'N', 'L', 'P', 'Q', 'R', 'S', 'T',
    'X', 'Y', 'Z'];

// Chichu:
const chichuLettersEdge = [
    'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'];

const chichuLettersCorner = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I',
    'W', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T',
    'X', 'Y', 'Z'];

const chichuLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'];

// Speffz: 
const speffzCorner = [
    'D', 'I', 'F',
    'A', 'E', 'R',
    'B', 'Q', 'N',
    'C', 'M', 'J',
    'U', 'G', 'L',
    'X', 'S', 'H',
    'W', 'O', 'T',
    'V', 'K', 'P'];

const speffzEdge = [
    'C', 'I', 'D', 'E', 'A', 'Q', 'B', 'M', 'U', 'K', 'X', 'G', 'W', 'S',
    'V', 'O', 'J', 'P', 'L', 'F', 'R', 'H', 'T', 'N'];
