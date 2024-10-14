// ==UserScript==
// @name        Fontchanger
// @icon        https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://fonts.google.com&size=256
// @description Change fonts for certain websites
// @author      stag-enterprises
//
// @version     2.0.2
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
// @grant       GM.deleteValue
// @grant       GM.xmlHttpRequest
// @top-level-await
// ==/UserScript==
// TODO
// - per site font url
// - font size customization
//////////////////////////////////////////////////

const GLOBAL_FONT_URL = "globalfonturl";

const getId = name => `____USERSCRIPT____${name}__${crypto.randomUUID()}`;

const loadFont = async url => {
  const name = getId("stagenterprises-Fontchanger");

  const font = await GM.xmlHttpRequest({ url, responseType: "arraybuffer" });
  const fontFace = new FontFace(name, font.response);
  await fontFace.load();
  document.fonts.add(fontFace);

  return name;
};

const setFontFamily = (selector, name) => document.querySelectorAll(selector).forEach(el => el.style.setProperty("font-family", name, "important"));
const setRootStyle = document.documentElement.style.setProperty.bind(document.documentElement.style);

await GM.registerMenuCommand("Set font url", async () => {
  let response;
  while (!response) {
    response = prompt("URL of font?");
  }

  await GM.setValue(GLOBAL_FONT_URL, response);
  alert("Set font url!");
  location.reload();
});

if (await GM.getValue(GLOBAL_FONT_URL)) {
  const globalFont = await loadFont(await GM.getValue(GLOBAL_FONT_URL));
  if (location.hostname === "dev.to") {
    // dev.to
    setFontFamily("div.crayons-article__body.text-styles.spec__body > *:not(.highlight.js-code-highlight", globalFont);
  } else if (location.hostname === "github.com") {
    // GitHub
    setRootStyle("--fontStack-monospace", globalFont);
  } else if (
    Array.from(document.querySelectorAll("img")).map(el => el.alt).includes("HedgeDoc")
  ) {
    // HedgeDoc
    setFontFamily("div.CodeMirror", globalFont);
  }
}

// Migrations
{
  const OLD_FONT_URL = "fonturl";
  if (await GM.getValue(OLD_FONT_URL)) {
    await GM.setValue(GLOBAL_FONT_URL, await GM.getValue(OLD_FONT_URL));
    await GM.deleteValue(OLD_FONT_URL);
    alert(`Migrated "${await GM.getValue(GLOBAL_FONT_URL)}" from ${OLD_FONT_URL} to ${GLOBAL_FONT_URL}`);
    location.reload();
  }
}
