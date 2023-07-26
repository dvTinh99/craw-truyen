const puppeteer = require('puppeteer');
const fs = require('fs');

main();
async function main() {
  // let url = 'https://ntruyen.vn/truyen/thuc-tinh-hinh-xam-53034/17169470.html'
  // await crawl(url);
  let chapters = [];
  for (let i = 17197442 ; i <= (17197442 + 100) ; i++) {
    chapters.push(i);
  }
  let url = 'https://ntruyen.vn/truyen/thuc-tinh-hinh-xam-53034/18788993.html';
  let nextLink = await crawl(url);
  console.log('next link: ' + nextLink);
  
  let i = 12;
  while (i < 100) {
    nextLink = await crawl(nextLink);
    i ++;
  }
}

async function crawl(url) {
  // Khởi tạo trình duyệt và trang mới
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  // Truy cập trang web chứa truyện tranh
  await page.goto(url);

  // Xem và kiểm tra cấu trúc của trang web để tìm các selector phù hợp với thông tin cần crawl
  const imageLinks = await page.evaluate(() => {
    const chapterContent = document.getElementById('chapter-content').childNodes;
    var string = document.getElementsByTagName('h1')[1].innerHTML;
    string = string.concat('\n');
    chapterContent.forEach((item) => {
      if (typeof item.innerHTML !== 'undefined') {
        if (item.localName == 'p') {
          let content = item.outerText;
          console.log('item.innerHTML', content);
  
          string = string.concat(content);
          string = string.concat('\n');
        }
      }
    });
    return string;
  });

  const nextLink = await page.evaluate(() => {
    
    return document.getElementsByClassName('next')[0].href;
  });

  fs.appendFile("conten.txt", imageLinks, function (err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });
  console.log('Các liên kết hình ảnh:', imageLinks);

  // Đóng trình duyệt
  await browser.close();
  return nextLink;
}