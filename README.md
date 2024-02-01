# Handlebar template to PDF

This library converts hbs templates to pdf.

And that's all.

### How to use

only call the "create" function

```js
import { create, registerHelpers } from "node-hbs-to-pdf";
import myTemplate from "./myTemplate.hbs";

// create(props: CreateProps): Promise<Buffer>
const PDF = await create({
  template: myTemplate,
  context: {
    any: "context or data",
    key: "value",
  },
});
const headers = new Headers({ "Content-Type": "application/pdf" });
return new Response(body, { status: 200, headers });

// OR
await create({
  template: myTemplate,
  context: {
    any: "context or data",
    key: "value",
  },
  path: "/path/to/save/file.pdf",
});
```

> **Any problem importing the ".hbs" file?**
> You can pass the file as ".txt" extension but having inside the handlebar template
>
> ```js
> import myTemplate from "./myTemplate.txt";
> ```

### Props

| Key                             | type             | Description                                                           |
| ------------------------------- | ---------------- | --------------------------------------------------------------------- |
| **template**                    | Buffer / string  | handlebar template (.hbs). It can be a Buffer or a string.            |
| **context**                     | object           | any data that you want to pass to handlebar template.                 |
| **path** _(optional)_           | string           | the path where you want to save the PDF file.                         |
| **margin** _(optional)_         | **MarginObject** | the margin of the pdf                                                 |
| **headerTemplate** _(optional)_ | Buffer / string  | handlebar template for document **header**                            |
| **footerTemplate** _(optional)_ | Buffer / string  | handlebar template for document **footer**                            |
| puppeteer                       | object           | puppeteer config, for now it only accepts **noSandbox** key (boolean) |

**MarginObject**
| Key | type
| ------ | ------ |
| top | string / number |
| bottom | string / number |
| left | string / number |
| right | string / number |

### How it works

This library uses the handlebar compiler to convert hbs template to html code and then, with puppeteer creates the pdf file.
