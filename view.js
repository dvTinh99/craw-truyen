const puppeteer = require('puppeteer');
async function crawl(url) {
    // Khởi tạo trình duyệt và trang mới
    const browser = await puppeteer.launch({
        headless: "new",
        // channel: 'chrome',
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    });
    const page = await browser.newPage();

    await page.setRequestInterception(true);
    page.on('request', request => {
    if (request.resourceType().toUpperCase() === 'IMAGE')
        request.abort();
    else
        request.continue();
    });

    // Truy cập trang web chứa truyện tranh
    await page.goto(url);

    // await autoScroll(page);

    const nextChap = await page.evaluate(async () => {
        let nextChap = document.getElementsByClassName('next-chap')
        if (!nextChap) return null;

        nextChap = nextChap[3];

        if (!nextChap) return null;

        nextChap = nextChap.childNodes;

        
        if (nextChap.length > 0) {
            nextChap = nextChap[0].href;
        }
        else return null;

        return nextChap;
    });


    
    // Đóng trình duyệt
    await browser.close();
    return nextChap;
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
    let url = "https://truyenhdt.com/truyen/khong-biet-bang-cach-nao-dan-my-nhan-hang-s-lai-de-cap-den-toi/chap/9573592-chuong-1/"
    let nextChap = await crawl(url);
    
    while (true) {
        if (!nextChap) {
            nextChap = url;
        }
        try {
            console.log('nextChap', nextChap);
            nextChap = await crawl(nextChap);
        } catch (error) {
            console.log('error', error);
            nextChap = url;
            nextChap = await crawl(nextChap);
        }
    }
}

main();