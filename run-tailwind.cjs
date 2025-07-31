const { execFile } = require('child_process');
const path = require('path');

const tailwindPath = path.join(__dirname, 'bin', 'tailwindcss.exe');

execFile(tailwindPath, [
  '-i', './src/preview/preview.css',
  '-o', './public/preview/styles.css',
  '--minify'
], (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`⚠️ stderr: ${stderr}`);
  }
  if (stdout) {
    console.log(stdout);
  }
});
