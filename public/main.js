const { app, BrowserWindow, Menu, dialog, shell } = require('electron')
const fs = require('fs')
const { ipcMain } = require('electron');

let window
let amountOfOpenWindows = 1;
const maximumAmountOfWindows = 3;

function createWindow() {

    if (amountOfOpenWindows > maximumAmountOfWindows) {

        dialog.showMessageBox({
            message: `You have opened too many windows.\n` +
                `You can open no more than ${maximumAmountOfWindows} windows.`
        });

        return;
    }

    window = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    amountOfOpenWindows++;

    window.loadURL('http://localhost:3000');

    window.webContents.openDevTools();
}

app.whenReady().then(() => {

    createWindow();

    const template = [
        {
            label: 'Window',
            submenu: [
                {
                    label: 'Open a new window',
                    accelerator: 'CmdOrCtrl+W',
                    click: createWindow
                }
            ]
        },

        {
            label: 'File',
            submenu: [
                {
                    label: 'Open a file',
                    accelerator: 'CmdOrCtrl+F',
                    click: openFile
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);

    Menu.setApplicationMenu(menu);
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {

    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

ipcMain.on('print-to-file', (_, data) => {

    dialog.showSaveDialog(window, {

        filters: [
            { name: '.json', extensions: ['json'] },
            { name: '.doc', extensions: ['doc'] }
        ]

    }).then(file => {

        if (!file.canceled) {

            const filePath = file.filePath.toString();

            fs.writeFile(filePath, data, error => {

                if (error) throw (error);

                console.log('The file was successfully saved');

            });

        }

    }).catch(error => console.log(error));

})

ipcMain.on('print-to-pdf', () => {

    dialog.showSaveDialog({

        filters: [{ name: '.pdf', extensions: ['pdf'] }]

    }).then(file => {

        if (!file.canceled) {

            const filePath = file.filePath.toString();

            const options = {
                marginsType: 0,
                pageSize: 'A4',
                printBackground: true,
                printSelectionOnly: false,
                landscape: false
            }

            window.webContents.printToPDF(options).then(data => {

                fs.writeFile(filePath, data, error => {

                    if (error) console.log(error);

                    else console.log('PDF Generated Successfully');

                });

            });
        }

    }).catch(error => console.log(error));

})

function openFile() {

    dialog.showOpenDialog({

        filters: [
            { name: '.json', extensions: ['json'] },
            { name: '.doc', extensions: ['doc'] }
        ]

    }).then(file => {

        if (!file.canceled) {

            const path = file.filePaths.toString();

            const content = fs.readFileSync(path).toString();

            window.webContents.send('fromFile', content);

        }

    }).catch(error => console.log(error));

}