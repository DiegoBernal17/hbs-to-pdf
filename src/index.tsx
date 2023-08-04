import Handlebars from "handlebars";
import puppeteer, { PDFMargin } from "puppeteer";

interface CreateProps {
  template: string | Buffer;
  context: object;
  path: string;
  margin?: PDFMargin;
}
export async function create(document: CreateProps): Promise<Buffer> {
  // Compile handlebar template
  return new Promise(async (resolve, reject) => {
    if (!document || !document.template || !document.context) {
      reject(new Error("Template and context are required"));
    }
    if (document.template instanceof Buffer) {
      document.template = document.template.toString("utf8");
    }
    if ("margin" in document) {
      if (typeof document.margin !== "object") {
        reject(new Error("margin must be an object"));
      }
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
    resolve(pdfBuffer);
  });
}

// Handlebar helper support
module.exports.registerHelper = (
  conditionName: string,
  fn: Handlebars.HelperDelegate
) => {
  Handlebars.registerHelper(conditionName, fn);
};
