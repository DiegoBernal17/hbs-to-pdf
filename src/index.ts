const puppeteer = require("puppeteer");
import Handlebars from "handlebars";

interface CreateProps {
  context: object;
  template: string | Buffer;
  headerTemplate?: string | Buffer;
  footerTemplate?: string | Buffer;
  path?: string;
  margin?: {
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
  };
  puppeteer?: {
    noSandbox?: boolean;
  };
}
export async function create(document: CreateProps): Promise<Buffer> {
  if (!document || !document.template || !document.context) {
    throw new Error("Template and context are required");
  }
  if ("margin" in document && typeof document.margin !== "object") {
    throw new Error("margin must be an object");
  }
  if (document.template instanceof Buffer) {
    document.template = document.template.toString("utf8");
  }
  const html = Handlebars.compile(document.template)(document.context);
  // launch a new chrome instance
  const browser = await puppeteer.launch({
    headless: "new",
    ...(document.puppeteer?.noSandbox && { args: ["--no-sandbox"] }),
  });
  // create a new page
  const page = await browser.newPage();
  // set your html as the pages content
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  // create a pdf buffer
  const pdfBuffer = await page.pdf({
    printBackground: true,
    format: "A4",
    path: document.path,
    margin: document.margin || {
      top: !!document.headerTemplate ? 220 : 20,
      bottom: !!document.footerTemplate ? 60 : 20,
      right: 40,
      left: 40,
    },
    displayHeaderFooter: !!document.headerTemplate || !!document.footerTemplate,
    headerTemplate: document.headerTemplate,
    footerTemplate: document.footerTemplate,
  });
  // close the browser
  await browser.close();
  return pdfBuffer;
}

// Handlebar helper support
export function registerHelpers(
  conditionName: string,
  fn: Handlebars.HelperDelegate
) {
  Handlebars.registerHelper(conditionName, fn);
}
