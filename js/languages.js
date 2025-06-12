// 自動偵測語言
function detectLang() {
    const lang = navigator.language.toLowerCase();
    if (lang.startsWith('zh-cn')) return 'zh-CN';
    if (lang.startsWith('zh-tw')) return 'zh-TW';
    if (lang.startsWith('zh-hk')) return 'zh-TW'; // 可自訂為 zh-HK
    if (lang.startsWith('zh')) return 'zh-TW';
    return 'en';
}

// 載入語言檔並更新文字
async function loadLanguage(lang) {
    try {
        const res = await fetch(`./locales/${lang}.json`);
        const dict = await res.json();

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (!dict[key]) return;

            const tag = el.tagName.toLowerCase();

            if (tag === 'title') {
                document.title = dict[key];
            } else if (tag === 'optgroup') {
                el.label = dict[key]; // 改 label 屬性，不要改 textContent
            } else if (tag === 'input' || tag === 'textarea') {
                if (el.hasAttribute('placeholder')) {
                    el.placeholder = dict[key]; // 對表單元素設置 placeholder
                } else {
                    el.value = dict[key]; // 例如 <input value="xxx">
                }
            } else if (el.hasAttribute('data-i18n-attr')) {
                // 可擴展：data-i18n-attr="title" 表示翻譯用於 title 屬性
                const attr = el.getAttribute('data-i18n-attr');
                el.setAttribute(attr, dict[key]);
            } else {
                el.textContent = dict[key]; // 常規元素顯示翻譯
            }
        });

        const selector = document.getElementById('langSwitcher');
        if (selector) selector.value = lang;

    } catch (err) {
        console.warn(`Failed to load language ${lang}, fallback to English.`);
        if (lang !== 'en') loadLanguage('en');
    }
}


// 初始化 + 綁定事件
window.addEventListener('DOMContentLoaded', () => {
    const defaultLang = detectLang();
    loadLanguage(defaultLang);

    document.getElementById('langSwitcher').addEventListener('change', (e) => {
        const selectedLang = e.target.value;
        loadLanguage(selectedLang);
    });
});