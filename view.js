const puppeteer = require('puppeteer');
async function crawl(url) {
    // Khởi tạo trình duyệt và trang mới
    const browser = await puppeteer.launch({
        headless: "new",
    });
    const page = await browser.newPage();

    // Truy cập trang web chứa truyện tranh
    await page.goto(url);

    await autoScroll(page);



    // Đóng trình duyệt
    await browser.close();
}

async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}

async function main() {
    let url = "https://truyenhdt.com/truyen/cuoc-song-moi-o-the-gioi-khac-lieu-co-hanh-phuc/chap/9554421-chuong-1/"
    await crawl(url);
}

main();