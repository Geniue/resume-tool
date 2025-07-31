// Enable Babel for JSX
require('@babel/register')({
  extensions: ['.js', '.jsx'],
  ignore: [/node_modules/],
});

const fs = require('fs-extra');
const path = require('path');
const React = require('react');
const ReactDOMServer = require('react-dom/server');

// Now we can safely import JSX files
const ResumePreviewDefault = require('./src/components/resume/ResumePreviewDefault').default;
const ResumePreviewModern = require('./src/components/resume/ResumePreviewModern').default;
const ResumePreviewMinimal = require('./src/components/resume/ResumePreviewMinimal').default;

const CoverPreviewDefault = require('./src/components/cover/CoverPreviewDefault').default;
const CoverPreviewCorporate = require('./src/components/cover/CoverPreviewCorporate').default;
const CoverPreviewCreative = require('./src/components/cover/CoverPreviewCreative').default;

// Sample data
const resumeData = {
  name: "Jane Doe",
  title: "Frontend Developer",
  email: "jane@example.com",
  phone: "(123) 456-7890",
  address: "456 Main St, City, Country",
  summary: "Passionate developer focused on UI/UX.",
  experience: "Developer at WebCo (2019–Present)",
  education: "B.A. Design, Art University",
  skills: "HTML, CSS, React, TypeScript"
};

const coverData = {
  name: "Jane Doe",
  jobTitle: "Frontend Developer",
  company: "Creative Digital Inc.",
  message: "I am excited to contribute to your team with strong UI/UX skills..."
};

// Map templates to components
const resumeTemplates = {
  default: ResumePreviewDefault,
  modern: ResumePreviewModern,
  minimal: ResumePreviewMinimal,
};

const coverTemplates = {
  default: CoverPreviewDefault,
  corporate: CoverPreviewCorporate,
  creative: CoverPreviewCreative,
};

// Simple HTML wrapper
function wrapHtml(body) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Preview</title>
      <link rel="stylesheet" href="/preview/styles.css" />
      
    </head>
    <body style="margin: 0; font-family: sans-serif;">
      ${body}
    </body>
    </html>
  `;
}

// Generate static previews
async function generate() {
  const outDir = path.join(__dirname, 'public', 'preview');
  await fs.ensureDir(outDir);

  for (const [key, Component] of Object.entries(resumeTemplates)) {
    const element = React.createElement(Component, { data: resumeData });
    const html = ReactDOMServer.renderToStaticMarkup(element);
    const filePath = path.join(outDir, 'resume', `${key}.html`);
    await fs.outputFile(filePath, wrapHtml(html));
    console.log(`✅ Generated resume: ${filePath}`);
  }

  for (const [key, Component] of Object.entries(coverTemplates)) {
    const element = React.createElement(Component, { data: coverData });
    const html = ReactDOMServer.renderToStaticMarkup(element);
    const filePath = path.join(outDir, 'cover', `${key}.html`);
    await fs.outputFile(filePath, wrapHtml(html));
    console.log(`✅ Generated cover: ${filePath}`);
  }

  console.log('\n🎉 All previews generated successfully!');
}

generate().catch((err) => {
  console.error('❌ Error generating previews:', err);
});
