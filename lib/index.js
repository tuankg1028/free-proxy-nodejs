"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProxies = void 0;
var cheerio_1 = __importDefault(require("cheerio"));
var puppeteer_extra_1 = __importDefault(require("puppeteer-extra"));
var puppeteer_extra_plugin_stealth_1 = __importDefault(require("puppeteer-extra-plugin-stealth"));
var proxy_checker_1 = __importStar(require("./utils/proxy-checker"));
var bluebird_1 = __importDefault(require("bluebird"));
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
function getProxies() {
    return __awaiter(this, void 0, void 0, function () {
        var browser, page, html, $, proxies, activeProxies;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, puppeteer_extra_1.default.launch({ headless: 'new' })];
                case 1:
                    browser = _a.sent();
                    return [4 /*yield*/, browser.newPage()];
                case 2:
                    page = _a.sent();
                    return [4 /*yield*/, page.goto('https://spys.one/en/free-proxy-list', {
                            waitUntil: 'networkidle0',
                        })];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, page.content()];
                case 4:
                    html = _a.sent();
                    return [4 /*yield*/, browser.close()];
                case 5:
                    _a.sent();
                    $ = cheerio_1.default.load(html, {});
                    $('script').remove();
                    proxies = [];
                    $('table > tbody table > tbody tr').each(function () {
                        var _a, _b;
                        var _c = $(this)
                            .find('td:nth-child(1)')
                            .text()
                            .trim()
                            .split(':'), host = _c[0], port = _c[1];
                        var protocol = $(this)
                            .find('td:nth-child(2)')
                            .text()
                            .trim()
                            .split(' ')[0];
                        var country = $(this).find('td:nth-child(4)').text().trim();
                        var status = (_b = (_a = $(this)
                            .find('td:nth-child(8) acronym')
                            .attr('title')) === null || _a === void 0 ? void 0 : _a.split('status=')) === null || _b === void 0 ? void 0 : _b.pop();
                        if (host && port && protocol && status === 'OK' && country) {
                            var proxy = { host: host, port: Number(port), protocol: protocol, country: country };
                            proxies.push(proxy);
                        }
                    });
                    return [4 /*yield*/, bluebird_1.default.Promise.filter(proxies, function (proxy) { return __awaiter(_this, void 0, void 0, function () {
                            var proxyStatus;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, (0, proxy_checker_1.default)(proxy)];
                                    case 1:
                                        proxyStatus = _a.sent();
                                        if (proxyStatus.status === proxy_checker_1.ProxyCheckerStatus.NOT_WORKING)
                                            return [2 /*return*/, false];
                                        return [2 /*return*/, true];
                                }
                            });
                        }); })];
                case 6:
                    activeProxies = _a.sent();
                    return [2 /*return*/, activeProxies];
            }
        });
    });
}
exports.getProxies = getProxies;
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
