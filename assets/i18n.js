/* bladydora.com — 中英切换
 *
 * 规则：只改写同时带 data-zh 与 data-en 的元素的 textContent。
 *
 * ⚠️ ICP 备案链接（.icp-link）刻意不带这两个属性，因此天然不在选择范围内；
 *    下面的 closest('.icp-link') 是第二道保险。
 *
 *    背景：SIMATRIX 官网曾用 last-child 选择器写页脚，把备案链接刷掉了。
 *    另外 smoke-bladydora.sh 要求 ICP 号在 HTML 源码中恰好出现 1 次，
 *    所以页脚只有一份、靠属性切换，不能中英各写一遍。
 *
 * 无 JS 时页面保持中文原样 —— 备案审核员与爬虫看到的就是中文页。
 */
(function () {
  'use strict';

  var KEY = 'bladydora:lang';
  var LANGS = ['zh', 'en'];

  function initial() {
    try {
      var q = new URLSearchParams(window.location.search).get('lang');
      if (LANGS.indexOf(q) !== -1) return q;
    } catch (e) { /* URLSearchParams 不可用则忽略 */ }

    try {
      var saved = window.localStorage.getItem(KEY);
      if (LANGS.indexOf(saved) !== -1) return saved;
    } catch (e) { /* 隐私模式下 localStorage 会抛错 */ }

    return 'zh';
  }

  function apply(lang) {
    document.documentElement.lang = (lang === 'en') ? 'en' : 'zh-CN';

    var nodes = document.querySelectorAll('[data-zh][data-en]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      if (el.closest && el.closest('.icp-link')) continue; // 见文件头说明
      var text = el.getAttribute('data-' + lang);
      if (text !== null) el.textContent = text;
    }

    var btn = document.getElementById('lang-toggle');
    if (btn) {
      var toEn = (lang === 'zh');
      btn.textContent = toEn ? 'EN' : '中文';
      btn.setAttribute('aria-pressed', String(!toEn));
      btn.setAttribute('aria-label', toEn ? 'Switch to English' : '切换到中文');
    }

    try { window.localStorage.setItem(KEY, lang); } catch (e) { /* 忽略 */ }
    document.documentElement.setAttribute('data-lang', lang);
  }

  var current = initial();
  apply(current);

  document.addEventListener('click', function (ev) {
    var btn = ev.target.closest && ev.target.closest('#lang-toggle');
    if (!btn) return;
    current = (current === 'zh') ? 'en' : 'zh';
    apply(current);
  });
})();
