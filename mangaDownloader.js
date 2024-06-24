"use strict";
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
var fs = require("fs");
var path = require("path");
var image_downloader_1 = require("image-downloader");
var pdf_lib_1 = require("pdf-lib");
var commander_1 = require("commander");
var program = new commander_1.Command();
program
    .requiredOption('-c, --chapter-id <chapterId>', 'Chapter ID')
    .option('-o, --output <output>', 'Output PDF file', 'output.pdf');
program.parse(process.argv);
var options = program.opts();
var MANGADEX_API_BASE = 'https://api.mangadex.org';
function fetchChapterPages(chapterId) {
    return __awaiter(this, void 0, void 0, function () {
        var chapterUrl, chapterResponse, chapterData, hash_1, pageArray, baseUrl, serverResponse, serverUrl_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    chapterUrl = "".concat(MANGADEX_API_BASE, "/chapter/").concat(chapterId);
                    return [4 /*yield*/, axios_1.default.get(chapterUrl)];
                case 1:
                    chapterResponse = _a.sent();
                    chapterData = chapterResponse.data.data;
                    hash_1 = chapterData.attributes.hash;
                    pageArray = chapterData.attributes.data;
                    baseUrl = "".concat(MANGADEX_API_BASE, "/at-home/server/").concat(chapterId);
                    return [4 /*yield*/, axios_1.default.get(baseUrl)];
                case 2:
                    serverResponse = _a.sent();
                    serverUrl_1 = serverResponse.data.baseUrl;
                    return [2 /*return*/, pageArray.map(function (filename) { return "".concat(serverUrl_1, "/data/").concat(hash_1, "/").concat(filename); })];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error fetching chapter pages:', error_1);
                    throw error_1;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function downloadImage(url, outputPath) {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, image_downloader_1.image)({
                            url: url,
                            dest: outputPath,
                        })];
                case 1:
                    _a.sent();
                    console.log("Downloaded ".concat(url, " to ").concat(outputPath));
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("Error downloading image ".concat(url, ":"), error_2);
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function downloadChapterPages(pages, downloadDir) {
    return __awaiter(this, void 0, void 0, function () {
        var downloadPromises;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!fs.existsSync(downloadDir)) {
                        fs.mkdirSync(downloadDir, { recursive: true });
                    }
                    downloadPromises = pages.map(function (pageUrl, index) {
                        var filePath = path.join(downloadDir, "".concat(index + 1, ".jpg"));
                        return downloadImage(pageUrl, filePath);
                    });
                    return [4 /*yield*/, Promise.all(downloadPromises)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createPdfFromImages(imageDir, outputPdfPath) {
    return __awaiter(this, void 0, void 0, function () {
        var pdfDoc, files, _i, files_1, file, filePath, imageBytes, image_1, page, pdfBytes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pdf_lib_1.PDFDocument.create()];
                case 1:
                    pdfDoc = _a.sent();
                    files = fs.readdirSync(imageDir).filter(function (file) { return file.endsWith('.jpg'); });
                    files.sort(function (a, b) { return parseInt(a) - parseInt(b); });
                    _i = 0, files_1 = files;
                    _a.label = 2;
                case 2:
                    if (!(_i < files_1.length)) return [3 /*break*/, 5];
                    file = files_1[_i];
                    filePath = path.join(imageDir, file);
                    imageBytes = fs.readFileSync(filePath);
                    return [4 /*yield*/, pdfDoc.embedJpg(imageBytes)];
                case 3:
                    image_1 = _a.sent();
                    page = pdfDoc.addPage([image_1.width, image_1.height]);
                    page.drawImage(image_1, {
                        x: 0,
                        y: 0,
                        width: image_1.width,
                        height: image_1.height,
                    });
                    _a.label = 4;
                case 4:
                    _i++;
                    return [3 /*break*/, 2];
                case 5: return [4 /*yield*/, pdfDoc.save()];
                case 6:
                    pdfBytes = _a.sent();
                    fs.writeFileSync(outputPdfPath, pdfBytes);
                    return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var chapterId, output, pages, downloadDir, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                chapterId = options.chapterId, output = options.output;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                return [4 /*yield*/, fetchChapterPages(chapterId)];
            case 2:
                pages = _a.sent();
                downloadDir = path.join(__dirname, 'downloads', chapterId);
                return [4 /*yield*/, downloadChapterPages(pages, downloadDir)];
            case 3:
                _a.sent();
                return [4 /*yield*/, createPdfFromImages(downloadDir, output)];
            case 4:
                _a.sent();
                console.log("PDF created at ".concat(output));
                return [3 /*break*/, 6];
            case 5:
                error_3 = _a.sent();
                console.error('Error:', error_3);
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); })();
