const letters = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

// 数据结构：key = 两个字母，如 "AB"，value 可以是字符串或数组
// 使用 localStorage 来存储数据，key: "letterTableData"

function loadData() {
    const raw = localStorage.getItem("letterTableData");
    if (raw) {
        try {
            return JSON.parse(raw);
        } catch {
            return {};
        }
    }
    return {};
}


function saveData(data) {
    localStorage.setItem("letterTableData", JSON.stringify(data));
}

// 渲染表格
function renderTable(data) {
    const table = document.getElementById("letterTable");
    table.innerHTML = "";

    // 表头空格 + 26列字母
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");
    headerRow.appendChild(document.createElement("th")); // 左上角空白

    letters.forEach(ch => {
        const th = document.createElement("th");
        th.textContent = ch;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // tbody 内容
    const tbody = document.createElement("tbody");
    letters.forEach(rowChar => {
        const tr = document.createElement("tr");
        // 行号（保持不变）
        const th = document.createElement("th");
        th.textContent = rowChar;
        tr.appendChild(th);

        letters.forEach(colChar => {
            const td = document.createElement("td");
            // key 顺序对调
            const key = colChar + rowChar;
            let val = data[key];
            if (Array.isArray(val) && val.length > 0) {
                val = val[0];
            }
            if (typeof val !== "string") {
                val = "";
                td.classList.add("empty");
            }
            td.textContent = val;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(tbody);
}

// 刷新表格显示
function refreshTable() {
    const data = loadData();
    renderTable(data);
}

// 页面加载时自动加载表格
window.onload = () => {
    const data = loadData();
    renderTable(data);  // 构建好内容
    document.getElementById("letterTable").style.display = "none";  // 隐藏
    nextCode();
}

// 显示/隐藏表格
function toggleTable() {
    const table = document.getElementById("letterTable");
    if (table.innerHTML.trim() === "") {
        renderTable(loadData());
    }
    if (table.style.display === "none") {
        table.style.display = "table";
    } else {
        table.style.display = "none";
    }
}

let currentCode = null;
let lastCode = null;
let hitFlag = 0; // 标记这道题的回答情况(0: create, 1: hit, 2: add, 3: skip)

const ffLetters = [
    'A', 'B', 'C',
    'D', 'K', 'F',
    'G', 'H', 'J',
    'W', 'M', 'N',
    'L', 'P', 'Q',
    'R', 'S', 'T',
    'X', 'Y', 'Z'];

const chichuLettersCorner = [
    'A', 'B', 'C',
    'D', 'E', 'F',
    'G', 'H', 'I',
    'W', 'M', 'N',
    'O', 'P', 'Q',
    'R', 'S', 'T',
    'X', 'Y', 'Z'];

const chichuLettersEdge = [
    'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'W', 'X', 'Y', 'Z'];

function nextCode(hitFlag) {
    lastCode = currentCode;

    // 模式选择
    const selectElement = document.getElementById('modes');
    const currentMode = selectElement.value;

    let r, c; // for letters
    let a, b; // for index of letters
    switch (currentMode) {
        case 'general':
            a = Math.floor(Math.random() * 26);
            b = Math.floor(Math.random() * 26);
            r = letters[a];
            c = letters[b];
            break;
        case 'ff':
            a = Math.floor(Math.random() * 21);
            do {
                b = Math.floor(Math.random() * 21);
            } while (a / 3 === b / 3);
            r = ffLetters[a];
            c = ffLetters[b];
            break;
        case 'corner-chichu':
            a = Math.floor(Math.random() * 21);
            do {
                b = Math.floor(Math.random() * 21);
            } while (a / 3 === b / 3);
            r = chichuLettersCorner[a];
            c = chichuLettersCorner[b];
            break;
        case 'edge-chichu':
            a = Math.floor(Math.random() * 22);
            do {
                b = Math.floor(Math.random() * 22);
            } while (a / 2 === b / 2);
            r = chichuLettersEdge[a];
            c = chichuLettersEdge[b];
            break;
        default:
            a = Math.floor(Math.random() * 26);
            b = Math.floor(Math.random() * 26);
            r = letters[a];
            c = letters[b];
            break;
    }

    currentCode = r + c;

    // Testing
    //currentCode = "AD";

    // 显示当前 code
    document.getElementById("currentCode").innerHTML = `当前: <b>${currentCode}</b>`;

    // 获取 lastCode 的联想词
    const data = loadData();
    let displayList = [];
    if (lastCode && data[lastCode]) {
        const entry = data[lastCode];
        displayList = Array.isArray(entry) ? entry : [entry];
    }

    let ansStatus = null;
    switch (hitFlag) {
        case 0:
            ansStatus = `<b style="color: #27548A">create</b>`;
            break;
        case 1:
            ansStatus = `<b style="color: #727D73">hit</b>`;
            break;
        case 2:
            ansStatus = `<b style="color: #ECB159">add</b>`;
            break;
        case 3:
            ansStatus = `<b style="color: #2b2b2b">skip</b>`;
            break;
        default:
            ansStatus = `<b>error</b>`;
            break;
    }

    document.getElementById("lastCode").innerHTML =
        lastCode ? `上一个: <b>${lastCode}</b> (${displayList.join(", ")}) ${ansStatus}` : "";

    // 清空输入框
    document.getElementById("userInput").value = "";
}

function goHead(arr, val) { // 把数组arr里的val提到最前面
    const i = arr.indexOf(val);
    if (i !== -1 && i !== 0) {
        [arr[i], arr[0]] = [arr[0], arr[i]];
    }
}

// 提交答案
function submitAnswer() {
    if (!currentCode) {
        alert("彩蛋");
        return;
    }

    const input = document.getElementById("userInput").value.trim();
    if (!input) {
        nextCode(3);
        return;
    }

    const data = loadData();
    const existing = data[currentCode];
    let hflag = -1;

    if (Array.isArray(existing)) { // 判断 exsting 是否是一个数组
        if (!existing.includes(input)) { // 判断数组中是否已包含 input
            existing.unshift(input); // 如果数组里面没有你输入的联想词, 就插入到开头
            hflag = 2;
            if (existing.length > 3) { // 让一个编码对应的词汇不超过三个
                existing.pop();
            }
        } else { // 数组中有这个input
            goHead(existing, input);
            hflag = 1;
        }
    } else if (typeof existing === "string") { //理论上就算只有一个联想词, 也是一个元素的数组, 所以用不到这个
        if (existing !== input) {
            data[currentCode] = [input, existing]; // input 在前
            hflag = 2;
        }
    } else { // 第一次输入该编码的联想词
        data[currentCode] = [input];
        hflag = 0;
    }

    saveData(data);

    // clear input content
    document.getElementById("userInput").value = "";
    nextCode(hflag);

    // 可选：刷新表格（如果显示中）
    renderTable(data);

}

function checkEnter(event) {
    if (event.key === "Enter") {
        submitAnswer();
    }
}
function clearAllData() {
    if (confirm("确定要清空所有数据吗？此操作不可恢复！")) {
        localStorage.removeItem("letterTableData"); // 删除数据
        renderTable(loadData());              // 重建空表
        alert("所有数据已清空！");
    }
}

// 下载当前 localStorage 数据
function downloadData() {
    const dataStr = localStorage.getItem("letterTableData") || "{}";
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "letterTableData.json";
    a.click();

    URL.revokeObjectURL(url);
}

// 导入本地 JSON 文件
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const json = JSON.parse(e.target.result);
            // 这里你可以加验证 json 结构的代码，确保格式正确

            localStorage.setItem("letterTableData", JSON.stringify(json));
            alert("导入成功，页面将刷新。");
            renderTable(loadData());  // 刷新表格显示最新数据
        } catch (error) {
            alert("导入失败：文件内容不是有效的 JSON。");
        }
    };
    reader.readAsText(file);

    // 重置文件输入，方便下次导入同一文件
    event.target.value = "";
}
