import { app, BrowserWindow } from "electron";
import path from "path";

import { isDev } from "./utils/is-dev";

app.on("ready", () => {
  console.log("app is ready");

  const window = new BrowserWindow({
    height: 400,
    width: 600,
    autoHideMenuBar: true,
  });

  if (isDev) window.loadURL("http://localhost:3000");
  else {
    const uri = path.resolve('dist', 'view', 'index.html')
    window.loadFile(uri);
  }
});
