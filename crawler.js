const puppeteer = require('puppeteer');
const fs = require('fs');

daThienDia();
async function main() {
  let chapters = [];
  for (let i = 2 ; i <= 100 ; i++) {
    chapters.push(i);
  }
  for (let chapter of chapters) {
    let url = 'https://truyenyy.vip/truyen/thuc-tinh-hinh-xam-ban-dich/chuong-'+chapter+'.html';
    await crawl(url);
  }
}
async function daThienDia() {
  //https://truyenyy.vip/truyen/da-thien-dia/chuong-2.html
  let chapters = [];
  for (let i = 2 ; i <= 308 ; i++) {
    chapters.push(i);
  }
  for (let chapter of chapters) {
    let url = 'https://truyenyy.vip/truyen/den-di-gioi-ta-lam-thanh-chu/chuong-'+chapter+'.html';
    let rs = await crawl(url);
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
    let location = window.location.href;
    var thenum = location.replace(/\D/g, '');
    // Ví dụ, tìm các liên kết hình ảnh trong trang
    const contentElements = document.getElementById('inner_chap_content_1').childNodes;
    var string = 'Chương '+thenum+': ';
    const title = document.getElementsByTagName('h2')[0].innerHTML;
    string = string.concat(title.replace(/\n/g, ''));
    string = string.concat('\n');
    contentElements.forEach((item) => {
      if (typeof item.innerHTML !== 'undefined') {
        console.log('item.innerHTML', item.innerHTML);

        string = string.concat(item.innerHTML);
        string = string.concat('\n');
      }
    });
    return string;
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
}