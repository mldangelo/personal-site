const fs = require('fs');
const path = require('path');
const resumeSchema = require('resume-schema');
const { compile } = require('json-schema-to-typescript');

(async () => {
  const resumeObject = JSON.parse(fs.readFileSync(path.join(__dirname, 'resume.json'), 'utf8'));
  resumeSchema.validate(resumeObject, () => {});
  const tsInterface = await compile(resumeSchema.schema, 'resume-schema');
  fs.writeFileSync(path.join(__dirname, 'resume.d.ts'), tsInterface);
})();
