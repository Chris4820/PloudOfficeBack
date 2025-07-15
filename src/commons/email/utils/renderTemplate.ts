import nunjucks from "nunjucks";




export function renderEmailTemplate(templateName: string, context: Record<string, any>): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log("CONTEXT", context);
    nunjucks.render(`emails/${templateName}.njk`, context.data, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}
