import puppeteer from "puppeteer";
import {} from "worker_threads";

async function run(url: string, name: string) {
    let browser = await puppeteer.launch({
        headless: false
    });
    let page = await browser.newPage();
    await page.goto(url);

    await page.focus("#yourNameInput")

    await page.keyboard.type(name);

    await page.keyboard.press("Tab");
    await page.keyboard.type("game");
    await page.keyboard.press("Enter");
    setTimeout(async () => {
        await page.hover(".PlayerCard_controlsWrapper__HLNLz div:nth-child(2) button")
        await page.mouse.down();
        await page.screenshot({
            path: name + ".png"
        })
        page.close();
        browser.close();
    }, 120000)
}
run("http://localhost:3000", "p" + Math.floor(Math.random() * 100));