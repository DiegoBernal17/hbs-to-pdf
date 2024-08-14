//const puppeteer = require("puppeteer");
import puppeteer from "puppeteer";
import Handlebars from "handlebars";

interface CreateProps {
  context: object;
  template: string | Buffer;
  headerTemplate?: string;
  footerTemplate?: string;
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
export async function create(props: CreateProps): Promise<Buffer> {
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
  const browser = await puppeteer.launch({
    headless: "new",
    ...(props.puppeteer?.noSandbox && { args: ["--no-sandbox"] }),
  });
  // create a new page
  const page = await browser.newPage();
  // set your html as the pages content
  await page.setContent(html, { waitUntil: "domcontentloaded" });
  // create a pdf buffer
  const pdfBuffer = await page.pdf({
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
