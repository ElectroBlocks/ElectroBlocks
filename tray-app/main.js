const { app, BrowserWindow, Tray, Menu } = require('electron');
const path = require('path');

let tray = null;
let mainWindow = null;

app.whenReady().then(() => {
    // Create system tray icon
    tray = new Tray(path.join(__dirname, 'icon.png')); // Add a custom icon
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Open ElectroBlocks', click: () => createWindow() },
        { type: 'separator' },
        { label: 'Quit', click: () => app.quit() }
    ]);
    tray.setToolTip('ElectroBlocks Tray App');
    tray.setContextMenu(contextMenu);

    // Create window when clicking tray icon
    tray.on('click', () => {
        if (mainWindow) {
            mainWindow.show();
        } else {
            createWindow();
        }
    });
});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false
        }
    });
    mainWindow.loadURL('https://electroblocks.org'); // Load the ElectroBlocks web app

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
