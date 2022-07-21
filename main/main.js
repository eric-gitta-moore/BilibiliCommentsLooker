const { app, BrowserWindow, session, ipcMain } = require("electron");
const {
  default: installExtension,
  VUEJS3_DEVTOOLS,
} = require("electron-devtools-installer");

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      //当设置为 false, 它将禁用同源策略
      webSecurity: false,
      //允许一个 https 页面运行来自http url的JavaScript, CSS 或 plugins
      allowRunningInsecureContent: true,

      //是否在独立 JavaScript 环境中运行 Electron API和指定的preload 脚本
      contextIsolation: false,
      //是否启用Node integration
      nodeIntegration: true,
      //是否在Web工作器中启用了Node集成.
      nodeIntegrationInWorker: true,
      //是否允许在子页面(iframe)或子窗口(child window)中集成Node.js
      nodeIntegrationInSubFrames: true,

      // preload: path.join(__dirname, "preload.js"),
    },
  });
  win.webContents.openDevTools();

  installExtension(VUEJS3_DEVTOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log("An error occurred: ", err));

  // win.loadFile('./main/index.html')
  win.loadURL("http://127.0.0.1:5173");
};
app.whenReady().then(() => {
  // // 需要拦截的URL地址
  const xxx_filter = {
    urls: [
      "https://api.bilibili.com/*",
      "http://*.hdslb.com/*",
      "https://*.hdslb.com/*",
    ],
  };
  session.defaultSession.webRequest.onBeforeSendHeaders(
    xxx_filter,
    (details, callback) => {
      // details.requestHeaders["Referer"] = details.url;
      // details.requestHeaders["Referer"] = undefined;

      delete details.requestHeaders["Referer"];
      callback({ requestHeaders: details.requestHeaders });
    }
  );

  createWindow();
});
