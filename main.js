var DEBUG = true;

const { app, Menu, Tray, BrowserWindow, ipcMain } = require('electron')
var path = require('path');
//pop window
{
    let popup = null;
    const createWindow = () => {
        if (DEBUG) {
            popup = new BrowserWindow({
                width: 200,
                height: 310,
                show: true,
                frame: true,
                fullscreenable: false,
                resizable: true,
                transparent: false,
                webSecurity: false,
                allowRunningInsecureContent: true
            })
        } else {
            popup = new BrowserWindow({
                width: 200,
                height: 310,
                show: false,
                frame: false,
                fullscreenable: false,
                resizable: false,
                transparent: true,
                webSecurity: false,
                allowRunningInsecureContent: true
            })
        }
        popup.loadURL('file://' + __dirname + '/tray.html');
        popup.on('blur', () => {
            if (!popup.webContents.isDevToolsOpened()) {
                popup.hide()
            }
        })
    }

    let tray = null
    const getWindowPosition = () => {
        const windowBounds = popup.getBounds()
        const trayBounds = tray.getBounds()
        // Center window horizontally below the tray icon
        const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2))
        // Position window 4 pixels vertically below the tray icon
        const y = Math.round(trayBounds.y + trayBounds.height + 3)
        return { x: x, y: y }
    }

    app.on('ready', () => {
        createWindow();
        tray = new Tray(path.resolve('./assets/logoTemplate.png'));
        // const contextMenu = Menu.buildFromTemplate([
        //     { label: 'Trello Service', type: "radio" },
        //     { label: "", type: 'separator' },
        //     { label: 'Quit' }
        // ])
        // // // tray.setTitle('1')
        // tray.setContextMenu(contextMenu)
        tray.on('click', function (event) {
            toggleWindow()
        })
    })

    const toggleWindow = () => {
        if (popup.isVisible()) {
            popup.hide()
        } else {
            showWindow()
        }
    }

    const showWindow = () => {
        const position = getWindowPosition()
        popup.setPosition(position.x, position.y, false)
        popup.show()
        popup.focus()
    }

    ipcMain.on('show-window', () => {
        showWindow()
    })
}

// let win
// function createWindow() {
//     win = new BrowserWindow({ width: 800, height: 600 })
//     win.loadFile('index.html')
//     win.webContents.openDevTools()
//     win.on('closed', () => {
//         win = null
//     })
// }
// app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

// app.on('activate', () => {
//     if (win === null) {
//         createWindow()
//     }
// })