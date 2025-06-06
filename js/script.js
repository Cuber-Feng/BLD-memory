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

// function saveSampleData(data) {
//     localStorage.setItem("sampleData", JSON.stringify(data));
// }

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

function nextCode() {
    lastCode = currentCode;

    const r = letters[Math.floor(Math.random() * 26)];
    const c = letters[Math.floor(Math.random() * 26)];
    currentCode = r + c;

    // 显示当前 code
    document.getElementById("currentCode").textContent = `当前: ${currentCode}`;

    // 获取 lastCode 的联想词
    const data = loadData();
    let displayList = [];
    if (lastCode && data[lastCode]) {
        const entry = data[lastCode];
        displayList = Array.isArray(entry) ? entry : [entry];
    }

    document.getElementById("lastCode").textContent =
        lastCode ? `上一个: ${lastCode} (${displayList.join(", ")})` : "";

    // 清空输入框
    document.getElementById("userInput").value = "";
}


// 提交答案
function submitAnswer() {
    if (!currentCode) {
        alert("请先点击『下一题』生成编码");
        return;
    }

    const input = document.getElementById("userInput").value.trim();
    if (!input) {
        nextCode();
        return;
    }

    const data = loadData();
    const existing = data[currentCode];

    if (Array.isArray(existing)) {
        if (!existing.includes(input)) {
            existing.unshift(input); // 插入到开头
        }
    } else if (typeof existing === "string") {
        if (existing !== input) {
            data[currentCode] = [input, existing]; // input 在前
        }
    } else {
        data[currentCode] = [input];
    }


    saveData(data);
    
    // clear input content
    document.getElementById("userInput").value = "";
    nextCode();


    // 可选：刷新表格（如果显示中）
    if (document.getElementById("letterTable").style.display !== "none") {
        renderTable(data);
    }
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
