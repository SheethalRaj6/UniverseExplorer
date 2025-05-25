const { app, BrowserWindow } = require('electron');

let mainWindow;

function createNewWindow(url) {
    const newWin = new BrowserWindow({
        show: false,
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    newWin.webContents.setWindowOpenHandler(({ url }) => {
        return createNewWindow(url); 
    });

    newWin.once('ready-to-show', () => {
        newWin.maximize();
        newWin.show();
    });

    newWin.loadURL(url);

    return { action: 'deny' }; 
}

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false 
        }
    });

    mainWindow.maximize();
    mainWindow.loadFile('landingpage.html');

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        return createNewWindow(url);
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
