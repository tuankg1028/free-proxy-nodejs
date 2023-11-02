# 🧰 Free proxy nodejs

> Free proxy nodejs is a lightweight Node.js NPM package designed to simplify the process of obtaining a list of proxies from https://spys.one. This package offers a convenient and customizable way to retrieve proxy data for your web scraping, security, or network-related projects. Whether you're working on web scraping tasks or require proxies for enhanced anonymity.


## Features
- Residential proxies
- Ease of Use: Easily fetch proxy data from https://spys.one with just a few lines of code.
- Customization: Configure the package to filter proxies based on your specific requirements, including country, anonymity level, and more.
- Reliability: Free proxy is built to handle changes in the website's structure, ensuring consistent proxy data retrieval.
- Proxy Validation: Validate the proxies to ensure they are working and responsive before use.

## Getting Started
### Installation

```bash
$ npm i free-proxy-nodejs -S
```

### Usage

#### Example
```ts
import freeProxy from 'free-proxy-nodejs';

// Get list proxies
const proxies = await freeProxy.getProxies()
```