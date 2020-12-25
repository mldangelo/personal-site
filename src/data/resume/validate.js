const fs = require('fs');
const resumeSchema = require('resume-schema');

const resumeObject = JSON.parse(fs.readFileSync('./resume.json', 'utf8'));
resumeSchema.validate(resumeObject, () => {});
