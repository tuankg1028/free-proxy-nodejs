import cheerio from 'cheerio';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import ProxyChecker, { ProxyCheckerStatus } from './utils/proxy-checker';
import bluebird from 'bluebird';

puppeteer.use(StealthPlugin());

export interface Proxy {
  host: string;
  port: number;
  protocol: string;
  country: string;
}

export async function getProxies(): Promise<Proxy[]> {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('https://spys.one/en/free-proxy-list', {
    waitUntil: 'networkidle0',
  });
  // await page.select("select[name='xpp']", '1');
  const html = await page.content();
  await browser.close();

  const $ = cheerio.load(html, {});
  $('script').remove();

  const proxies: Proxy[] = [];
  $('table > tbody table > tbody tr').each(function () {
    const [host, port] = $(this)
      .find('td:nth-child(1)')
      .text()
      .trim()
      .split(':');
    const protocol = $(this)
      .find('td:nth-child(2)')
      .text()
      .trim()
      .split(' ')[0];
    const country = $(this).find('td:nth-child(4)').text().trim();
    const status = $(this)
      .find('td:nth-child(8) acronym')
      .attr('title')
      ?.split('status=')
      ?.pop();

    if (host && port && protocol && status === 'OK' && country) {
      const proxy = { host, port: Number(port), protocol, country };
      proxies.push(proxy);
    }
  });

  const activeProxies = await bluebird.Promise.filter(
    proxies,
    async (proxy) => {
      const proxyStatus = await ProxyChecker(proxy);
      if (proxyStatus.status === ProxyCheckerStatus.NOT_WORKING) return false;

      return true;
    },
  );
  return activeProxies;
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
