import puppeteer, { Browser } from "puppeteer";
import {Worker} from "worker_threads"

// async function connect_to_game(url: string, name: string){
//     let browser = await puppeteer.launch({
//         headless: false
//     });
//     let page = await browser.newPage();
//     await page.goto(url);

//     await page.focus("#yourNameInput")

//     await page.keyboard.type(name);

//     await page.keyboard.press("Tab");
//     await page.keyboard.type("game");
//     await page.keyboard.press("Enter");
//     setTimeout(async () => {
//         await page.hover("button.PlayerCard_holdButton__zMPRc")
//         await page.mouse.down();
//         await page.screenshot({
//             path: name+".png"
//         })
//         page.close();
//         browser.close();
//     }, 20000)
// }


let browser: Browser;
async function run(url: string, name: string) {
    if(browser === undefined){
        browser = await puppeteer.launch({
            headless: false
        });
    }
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

// puppeteer.launch({
//     headless: false
// }).then(res => {
//     browser = res;
//     for(let i = 0; i < 3; i++){
//         run("http://localhost:3000", "Player"+i)
//     }
// });




for(let i = 0; i < 20; i++){
    // connect_to_game("http://localhost:3000", "Player " + i);
    new Worker("./dist/worker_invocation.js")
}