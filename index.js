const { app, BrowserWindow } = require('electron')
const { execSync } = require('child_process');

try {
  execSync('node loader.js', { cwd: __dirname });
} catch (err) {
  console.log('Failed to run loader.js', err);
  process.exit();
}

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // width: 1500,
    // height: 900,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('src/index.html')

  // win.webContents.openDevTools();
}

app.whenReady().then(createWindow)
