// ==UserScript==
// @name        Fontchanger
// @icon        https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://fonts.google.com&size=256
// @description Change fonts for certain websites
// @author      stag-enterprises
//
// @version     0.3.2
// @downloadURL https://github.com/stag-enterprises/fontchanger/raw/refs/heads/main/script.user.js
// @homepageURL https://github.com/stag-enterprises/fontchanger
// @supportURL  https://github.com/stag-enterprises/fontchanger/issues
// @namespace   stag.lol
//
// @match       *://dev.to/*
// @match       *://doc.adminforge.de/*
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @top-level-await
// ==/UserScript==

const SELECTORS = {
  "dev.to": "div.crayons-article__body.text-styles.spec__body > *:not(.highlight.js-code-highlight)",
  "doc.adminforge.de": "div.CodeMirror",
};

const generateUniqueId = name => `____USERSCRIPT____${name}__${crypto.randomUUID()}`;
const GM_fetch = (url, options) => new Promise((resolve, reject) => new GM_xmlhttpRequest({
  url,
  ...options,
  onabort: reject,
  onerror: reject,
  ontimeout: reject,
  onload: resolve,
}));

GM_registerMenuCommand("Set font url", () => {
  let fontUrl;
  while (!fontUrl) {
    fontUrl = prompt("URL of font?");
  }

  GM_setValue("fonturl", fontUrl);
  alert("Set font url");
});

const fontUrl = GM_getValue("fonturl");
if (fontUrl) {
  const font = await GM_fetch(fontUrl, { responseType: "arraybuffer" })
  const fontName = generateUniqueId("stagenterprises-Fontchanger");
  const fontFace = new FontFace(fontName, font.response);
  await fontFace.load();
  document.fonts.add(fontFace);

  document.querySelectorAll(SELECTORS[window.location.hostname]).forEach(el => el.style.fontFamily = fontName);
}
