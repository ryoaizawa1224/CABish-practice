const { app, BrowserWindow } = require("electron");
const path = require("path");
const serve = require("electron-serve");

// out/ ディレクトリを app:// スキームで配信
const loadURL = serve({ directory: path.join(__dirname, "../out") });

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    minWidth: 400,
    minHeight: 500,
    title: "CAB 練習ツール",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
    titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
    backgroundColor: "#111827", // gray-900 と合わせてチラつき防止
  });

  // electron-serve で app://. として Next.js の静的ファイルを配信
  // → useRouter().push("/result") がそのまま動く
  loadURL(win);

  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
