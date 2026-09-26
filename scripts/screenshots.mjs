// Usage: pnpm shots -- / /o-nas   (server must run on BASE, default http://localhost:3000)
// Writes screenshots/<route>-<width>.png, exits 1 on horizontal overflow or a
// mobile menu that does not list the nav links without JavaScript.
import puppeteer from "puppeteer-core";
import fs from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const WIDTHS = [320, 390, 768, 1440];
const paths = process.argv.slice(2).filter((a) => a !== "--");
if (!paths.length) paths.push("/");
fs.mkdirSync("screenshots", { recursive: true });

const browser = await puppeteer.launch({ headless: true, executablePath: CHROME });
let failed = false;
for (const p of paths) {
  for (const width of WIDTHS) {
    const page = await browser.newPage();
    await page.setViewport({ width, height: 900, deviceScaleFactor: 1, isMobile: width < 768 });
    await page.goto(BASE + p, { waitUntil: "networkidle0" });
    const overflow = await page.evaluate(() => {
      const w = document.documentElement.clientWidth;
      return [...document.querySelectorAll("body *")]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return r.width > 0 && r.right > w + 1 && !e.closest("[data-overflow-ok]");
        })
        .slice(0, 5)
        .map((e) => `${e.tagName}.${e.className}`.slice(0, 80));
    });
    if (overflow.length) {
      failed = true;
      console.error(`OVERFLOW ${p} @${width}:`, overflow);
    }
    const name = (p === "/" ? "home" : p.replace(/\//g, "_").replace(/^_/, "")) + `-${width}.png`;
    await page.screenshot({ path: `screenshots/${name}`, fullPage: true });
    await page.close();
  }
  // No-JS check: the mobile menu (<details data-mobile-menu>) must list every nav link.
  const page = await browser.newPage();
  await page.setJavaScriptEnabled(false);
  await page.setViewport({ width: 390, height: 844, isMobile: true });
  await page.goto(BASE + p, { waitUntil: "load" });
  const links = await page.$$eval("[data-mobile-menu] a", (as) => as.map((a) => a.getAttribute("href")));
  if (links.length < 5) {
    failed = true;
    console.error(`NOJS ${p}: mobile menu has ${links.length} links`);
  }
  await page.close();
}
await browser.close();
if (failed) process.exit(1);
console.log("shots ok:", paths.join(" "));
