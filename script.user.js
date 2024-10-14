// ==UserScript==
// @name        Fontchanger
// @icon        https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://fonts.google.com&size=256
// @description Change fonts for certain websites
// @author      stag-enterprises
//
// @version     2.0.0
// @downloadURL https://github.com/stag-enterprises/fontchanger/raw/refs/heads/main/script.user.js
// @homepageURL https://github.com/stag-enterprises/fontchanger
// @supportURL  https://github.com/stag-enterprises/fontchanger/issues
// @namespace   stag.lol
//
// @match       *://dev.to/*
// @match       *://doc.adminforge.de/*
// @match       *://github.com/*
// @grant       GM.registerMenuCommand
// @grant       GM.setValue
// @grant       GM.getValue
// @grant       GM.xmlhttpRequest
// @top-level-await
// ==/UserScript==
// TODO
// - per site font url
//////////////////////////////////////////////////

const GLOBAL_FONT_URL = "globalfonturl";

const getId = name => `____USERSCRIPT____${name}__${crypto.randomUUID()}`;

const loadFont = async url => {
  const name = getId("stagenterprises-Fontchanger");

  const font = await GM.xmlhttpRequest({ url, responseType: "arraybuffer" });
  const fontFace = new FontFace(name, font.response);
  await fontFace.load();
  document.fonts.add(fontFace);

  return name;
};

const setFontFamily = (selector, name) => document.querySelectorAll(selector).forEach(el => el.style.setProperty("font-family", name, "important"));
const setRootStyle = document.documentElement.style.setProperty.bind(document.documentElement.style);

GM.registerMenuCommand("Set font url", () => {
  let fontUrl;
  while (!fontUrl) {
    fontUrl = prompt("URL of font?");
  }

  await GM.setValue("fonturl", fontUrl);
  alert("Set font url");
});

const globalFont = await loadFont(GM.getValue(GLOBAL_FONT_URL));
if (globalFont) {
  if (location.hostname === "dev.to") {
    // dev.to
    setFontFamily("div.crayons-article__body.text-styles.spec__body > *:not(.highlight.js-code-highlight", globalFont);
  } else if (location.hostname === "github.com") {
    // GitHub
    setRootStyle("--fontStack-monospace", globalFont)
  } else if (Array.from(document.querySelectorAll("img")).map(el => el.alt).includes("HedgeDoc")) {
    // HedgeDoc
    setFontFamily("div.CodeMirror", globalFont);
  }
}
