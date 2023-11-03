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
  latency: number;
}
export enum ProxyProtocol {
  'HTTP' = 'HTTP',
  'HTTPS' = 'HTTPS',
  'SOCKS' = 'SOCKS',
}
interface GetProxiesOptions {
  protocol?: ProxyProtocol;
}

export async function getProxies(otps?: GetProxiesOptions): Promise<Proxy[]> {
  const browser = await puppeteer.launch({
    headless: 'new',
  });
  const page = await browser.newPage();
  await page.goto('https://spys.one/en/free-proxy-list', {
    waitUntil: 'domcontentloaded',
  });

  const html = await page.content();
  await browser.close();

  const $ = cheerio.load(html, {});
  $('script').remove();

  let proxies: Proxy[] = [];
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
    const latency = $(this).find('td:nth-child(6)').text().trim();
    const status = $(this)
      .find('td:nth-child(8) acronym')
      .attr('title')
      ?.split('status=')
      ?.pop();

    if (host && port && protocol && status === 'OK' && country) {
      const proxy = {
        host,
        port: Number(port),
        protocol,
        country,
        latency: Number(latency),
      };
      proxies.push(proxy);
    }
  });

  const { protocol } = otps || {};
  if (protocol) {
    proxies = proxies.filter((proxy) => proxy.protocol === protocol);
  }

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
