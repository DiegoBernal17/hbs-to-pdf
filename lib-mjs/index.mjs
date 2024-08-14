var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//const puppeteer = require("puppeteer");
import puppeteer from "puppeteer";
import Handlebars from "handlebars";
export function create(props) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (!props || !props.template || !props.context) {
            throw new Error("Template and context are required");
        }
        if ("margin" in props && typeof props.margin !== "object") {
            throw new Error("margin must be an object");
        }
        if (props.template instanceof Buffer) {
            props.template = props.template.toString("utf8");
        }
        const html = Handlebars.compile(props.template)(props.context);
        // launch a new chrome instance
        const browser = yield puppeteer.launch(Object.assign({ headless: "new" }, (((_a = props.puppeteer) === null || _a === void 0 ? void 0 : _a.noSandbox) && { args: ["--no-sandbox"] })));
        // create a new page
        const page = yield browser.newPage();
        // set your html as the pages content
        yield page.setContent(html, { waitUntil: "domcontentloaded" });
        // create a pdf buffer
        const pdfBuffer = yield page.pdf({
            printBackground: true,
            format: "A4",
            path: props.path,
            margin: props.margin || {
                top: !!props.headerTemplate ? 220 : 20,
                bottom: !!props.footerTemplate ? 60 : 20,
                right: 40,
                left: 40,
            },
            displayHeaderFooter: !!props.headerTemplate || !!props.footerTemplate,
            headerTemplate: props.headerTemplate,
            footerTemplate: props.footerTemplate,
        });
        // close the browser
        yield browser.close();
        return pdfBuffer;
    });
}
// Handlebar helper support
export function registerHelpers(conditionName, fn) {
    Handlebars.registerHelper(conditionName, fn);
}
