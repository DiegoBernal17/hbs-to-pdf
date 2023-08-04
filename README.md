# Handlebar to PDF

This library converts hbs templates to pdf.

And that's all.

### How to use

only call the "create" function

```js
import template from "./myTemplate.hbs";

craete({
  template,
  context: {
    any: "context or data",
  },
});
```

**template**: he handlebar template (.hbs). It can be a Buffer or a string.
**context**: any data that you want to pass to handlebar template.
**path** _(optional)_: the path where you want to save the PDF file.
**margin** _(optional)_: the margin of the pdf
