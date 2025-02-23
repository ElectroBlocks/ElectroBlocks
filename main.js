import { app, BrowserWindow, Menu, shell } from "electron";

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false, // Security best practice
    },
  });
  // Create a menu with a link
  const menuTemplate = [
    {
      label: "Ports",
      submenu: [
        {
          label: "View Available Ports",
          click: () => {
            shell.openExternal("http://localhost:3000/ports"); // Opens in browser
          },
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
});
