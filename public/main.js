const { app, BrowserWindow, Menu, dialog, shell} = require('electron')
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
                    click: createWindow
                }
            ]
        },

        {
            label: 'File',
            submenu: [
                {
                    label: 'Open a file',
                    accelerator: 'CmdOrCtrl+O',
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

ipcMain.on('print-to-file', (event, data) => {

    dialog.showSaveDialog(window, {

        filters: [
            {name: '.json', extensions: ['json']},
            {name: '.doc', extensions: ['doc']}
        ]

    }).then(file => {

        if (!file.canceled) {

            const filePath = file.filePath.toString();

            fs.writeFile(filePath, data, error => {

                if (error) throw(error);

                console.log('The file was successfully saved');

            });

        }

    }).catch(error => console.log(error.message));

})

ipcMain.on('print-to-pdf', event => {

    dialog.showSaveDialog({

        filters: [{name: '.pdf', extensions: ['pdf']}]

    }).then(file => {

        if (!file.canceled) {

            let filePath = file.filePath.toString();

            window.webContents.printToPDF({}, (error, data) => {

                filePath = './doc.pdf';

                if (error) console.log(error.message);

                fs.writeFile(filePath, data, error => {

                    if (error) console.log(error.message);

                    console.log('The file was successfully saved');

                });

            });
        }

    }).catch(error => console.log(error.message));

})

function openFile() {

    let windows = BrowserWindow.getAllWindows();

    console.log(windows);

    dialog.showOpenDialog({

        filters: [
            {name: '.json', extensions: ['json']},
            {name: '.doc', extensions: ['doc']}
        ]

    }).then(file => {

        if (!file.canceled) {

            const path = file.filePaths.toString();

            const content = fs.readFileSync(path).toString();

            window.webContents.send('fromFile', content);
            
        }

    }).catch(error => console.log(error));
    
}