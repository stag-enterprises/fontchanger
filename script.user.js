// ==UserScript==
// @name        Fontchanger
// @icon        https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://fonts.google.com&size=256
// @description Change fonts for articles
// @author      stag-enterprises
//
// @version     0.1
// @updateURL   https://github.com/stag-enterprises/fontchanger/raw/refs/heads/main/script.user.js
// @homepageURL https://github.com/stag-enterprises/fontchanger
// @supportURL  https://github.com/stag-enterprises/fontchanger/issues
// @namespace   stag.lol
//
// @match       *://dev.to/*
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @top-level-await
// ==/UserScript==

const generateUniqueId = (name) => `____USERSCRIPT____${name}__${crypto.randomUUID()}`;

GM_registerMenuCommand("Set font url", () => {
  let fontUrl;
  while (!fontUrl) {
    fontUrl = prompt("URL of font?");
  }

  GM_setValue("fonturl", fontUrl);
  alert("Set font url");
});

const SELECTORS = {
  "dev.to": "div.crayons-article__body.text-styles.spec__body > *:not(.highlight.js-code-highlight)",
};

const fontUrl = GM_getValue("fonturl");
if (fontUrl) {
  const fontName = generateUniqueId("stagenterprises-Fontchanger");
  const font = new FontFace(fontName, `url(${fontUrl})`);
  await font.load();
  document.fonts.add(font);

  document.querySelectorAll(SELECTORS[window.location.hostname]).forEach(el => el.style.fontFamily = fontName);
}
