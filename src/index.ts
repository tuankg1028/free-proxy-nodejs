import cheerio from 'cheerio';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

puppeteer.use(StealthPlugin());

interface Proxy {
  host: string;
  port: number;
  type: string;
  country: string;
}

export async function getProxies(): Promise<Proxy[]> {
  puppeteer;
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://spys.one/free-proxy-list', {
    waitUntil: 'networkidle0',
  });

  const html = await page.content();
  const $ = cheerio.load(html, {});
  $('script').remove();

  const proxies: Proxy[] = [];
  $('table table table:nth-child(2) > tbody tr').each(function () {
    const [host, port] = $(this)
      .find('td:nth-child(1)')
      .text()
      .trim()
      .split(':');
    const type = $(this).find('td:nth-child(2)').text().trim().split(' ')[0];
    const country = $(this).find('td:nth-child(4)').text().trim();
    const status = $(this)
      .find('td:nth-child(5) acronym')
      .attr('title')
      ?.split('status=')
      ?.pop();

    if (host && port && type && status === 'OK' && country) {
      proxies.push({ host, port: Number(port), type, country });
    }
  });

  return proxies;
}

// export async function getProxies(): Promise<Proxy[]> {
//   puppeteer;
//   const browser = await puppeteer.launch({ headless: 'new' });
//   const page = await browser.newPage();
//   await page.goto('https://spys.one/free-proxy-list', {
//     waitUntil: 'networkidle0',
//   });

//   const html = await page.content();
//   const $ = cheerio.load(html, {});
//   $('script').remove();

//   const proxies: Proxy[] = [];
//   $('table > tbody table > tbody tr').each(function (i) {
//     if (i < 3) return;

//     const [host, port] = $(this).find('td:nth-child(1)').text().split(':');
//     const type = $(this).find('td:nth-child(2)').text().split(' ')[0];
//     const status = $(this)
//       .find('td:nth-child(8) acronym')
//       .attr('title')
//       ?.split('status=')
//       ?.pop();

//     if (host && port && type && status === 'OK') {
//       proxies.push({ host, port: Number(port), type });
//     }
//   });

//   return proxies;
// }
