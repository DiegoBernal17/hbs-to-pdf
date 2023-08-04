const puppeteer = require("puppeteer");
import Handlebars from "handlebars";

interface CreateProps {
  template: string | Buffer;
  context: object;
  path?: string;
  margin?: {
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
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
  const browser = await puppeteer.launch({ headless: "new" });
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
      top: 20,
      right: 40,
      bottom: 20,
      left: 40,
    },
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
