import { HttpProxyAgent } from 'http-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent';
import { HttpsProxyAgent } from 'https-proxy-agent';
import { Proxy } from '../index';
import axios from 'axios';

export enum ProxyCheckerStatus {
  ACTIVE = 'Active',
  NOT_WORKING = 'Not-working',
}

interface ProxyCheckerRes {
  status: ProxyCheckerStatus;
  error?: string;
}
const ProxyChecker = async (proxy: Proxy): Promise<ProxyCheckerRes> => {
  let agent;
  try {
    switch (proxy.protocol) {
      case 'HTTP':
        agent = new HttpProxyAgent(`http://${proxy.host}:${proxy.port}`);
        break;
      case 'HTTPS':
        agent = new HttpsProxyAgent(`https://${proxy.host}:${proxy.port}`);
        break;
      case 'SOCKS5':
      case 'SOCKS':
        agent = new SocksProxyAgent(`socks://${proxy.host}:${proxy.port}`);
        break;
    }

    const res = await axios.get('http://api.ipify.org?format=json', {
      timeout: 10_000,
      httpAgent: agent,
    });

    if (!res.data?.ip) {
      throw new Error('IP not found');
    }
    return { status: ProxyCheckerStatus.ACTIVE };
  } catch (error) {
    let errorMessage = 'Failed to do something exceptional';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { status: ProxyCheckerStatus.NOT_WORKING, error: errorMessage };
  }
};

export default ProxyChecker;
