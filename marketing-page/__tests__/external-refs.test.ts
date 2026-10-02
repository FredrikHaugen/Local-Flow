import { describe, expect, test } from "vitest";
import { findExternalCssUrls, findExternalRefs } from "../scripts/external-refs.mjs";

describe("findExternalRefs", () => {
  test("flags third-party scripts, stylesheets, images and iframes", () => {
    const html = `
      <script async src="https://www.googletagmanager.com/gtag/js"></script>
      <link rel="stylesheet" href="//fonts.googleapis.com/css2?family=Inter">
      <img alt="" src="http://example.com/pixel.gif">
      <iframe src="https://www.youtube.com/embed/x"></iframe>`;
    expect(findExternalRefs(html)).toEqual([
      "https://www.googletagmanager.com/gtag/js",
      "//fonts.googleapis.com/css2?family=Inter",
      "http://example.com/pixel.gif",
      "https://www.youtube.com/embed/x",
    ]);
  });

  test("ignores same-origin assets, data URIs and plain links", () => {
    const html = `
      <script src="/_next/static/chunks/main.js"></script>
      <link rel="stylesheet" href="/_next/static/css/app.css">
      <img alt="" src="data:image/png;base64,AAAA">
      <a href="https://github.com/FredrikHaugen/peluni">GitHub</a>`;
    expect(findExternalRefs(html)).toEqual([]);
  });
});

describe("findExternalCssUrls", () => {
  test("flags remote url() and @import, ignores local ones", () => {
    const css = `
      @import url("https://fonts.googleapis.com/css2?family=Inter");
      @font-face { src: url(/_next/static/media/geist.woff2) format("woff2"); }
      .x { background: url('//cdn.example.com/bg.png'); }`;
    expect(findExternalCssUrls(css)).toEqual([
      "https://fonts.googleapis.com/css2?family=Inter",
      "//cdn.example.com/bg.png",
    ]);
  });
});
