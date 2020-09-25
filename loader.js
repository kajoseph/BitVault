const sass = require('node-sass');
const path = require('path');
const fs = require('fs');

const headerWarning = `/* =================================
 This was automatically generated using loader.js
 Any modifications will be overwritten
 ================================= */
`;

const headerWarningBuffer = Buffer.from(headerWarning);

let { css } = sass.renderSync({
  file: path.join(__dirname, 'src/styles/style.scss'),
  outputStyle: 'compressed',
  outFile: path.join(__dirname, 'src/styles/style.css'),
});

fs.writeFileSync(path.join(__dirname, 'src/styles/style.css'), Buffer.concat([headerWarningBuffer, css]));
