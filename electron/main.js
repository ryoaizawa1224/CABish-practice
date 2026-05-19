const { app, BrowserWindow, protocol, net } = require("electron");
const path = require("path");
const url = require("url");
const fs = require("fs");

// app:// スキームを安全なカスタムプロトコルとして登録（app.ready より前に呼ぶ必要がある）
protocol.registerSchemesAsPrivileged([
  {
    scheme: "app",
    privileges: {
      secure: true,
      standard: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

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
    backgroundColor: "#111827",
  });

  // out/ ディレクトリを app:// として配信
  // Next.js の useRouter().push("/result") がそのまま動く
  protocol.handle("app", (request) => {
    // "app://./result/" → "result/"
    let pathname = request.url.slice("app://./".length);

    // 末尾スラッシュやルートを index.html に解決
    const candidates = [
      path.join(__dirname, "../out", pathname),
      path.join(__dirname, "../out", pathname, "index.html"),
      path.join(__dirname, "../out/index.html"),
    ];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
        return net.fetch(url.pathToFileURL(candidate).toString());
      }
    }

    // fallback
    return net.fetch(
      url.pathToFileURL(path.join(__dirname, "../out/index.html")).toString()
    );
  });

  win.loadURL("app://./");
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
