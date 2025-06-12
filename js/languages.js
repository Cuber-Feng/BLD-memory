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
            if (dict[key]) {
                if (el.tagName.toLowerCase() === 'title') {
                    document.title = dict[key];
                } else {
                    el.textContent = dict[key];
                }
            }
        });

        // 設定選單同步顯示目前語言
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