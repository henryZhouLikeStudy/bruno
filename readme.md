<br />
<img src="assets/images/logo-transparent.png" width="80"/>

# Bruno 中文版

> 默认简体中文（`zh-CN`）的 Windows 构建版本。

本版本默认使用简体中文（`zh-CN`），提供 Windows x64 免安装 NoAdmin 版、安装版和传统 Portable 版。

## 下载

前往 [GitHub Actions 中文版构建](https://github.com/henryZhouLikeStudy/bruno/actions/workflows/build-windows-portable.yml)，打开最新成功运行，在页面底部下载：

- `Bruno_zh-CN_Windows_x64_Portable_NoAdmin`（推荐）—— 免安装 ZIP 版，无需管理员权限，适合受限账号与远程桌面（RDP）等非管理员环境
- `Bruno_zh-CN_Windows_x64_Portable_NoAdmin_NoElevate`（实验性诊断产物，非推荐默认）—— 在 NoAdmin 版基础上移除 `resources/elevate.exe`，用于排查受限环境下与权限提升或更新相关的行为；请在与 DBX 能正常运行的同一 RDP 文件夹中测试能否启动
- `Bruno_zh-CN_Windows_x64_Setup` —— NSIS 安装版
- `Bruno_zh-CN_Windows_x64_Portable` —— 传统便携 EXE 版（NSIS 自解压，可能在受限环境被拦截）

### NoAdmin 版使用说明

1. 下载 `Bruno_zh-CN_Windows_x64_Portable_NoAdmin` artifact。GitHub 会将 artifact 打包为外层 ZIP 下载；若 Windows 显示安全提示或“文件已阻止”（来自网络的文件常被标记为不安全），请先解除锁定：右键文件 → 属性 → 勾选“解除锁定”→ 确定，或在 PowerShell 中执行 `Unblock-File`。
2. 先解压 GitHub 下载的外层 artifact 压缩包，得到内部的 `Bruno_zh-CN_Windows_x64_Portable_NoAdmin.zip`（若仍提示已阻止，同样先解除锁定）。
3. 再将内部 ZIP 完整解压到本机用户可写目录，例如“文档（Documents）”或允许的工作目录。
4. 进入解压后的 `Bruno_zh-CN_Windows_x64_Portable_NoAdmin` 文件夹，双击运行 `Bruno.exe`。

> ⚠️ 注意事项：
> - 请勿在 ZIP 压缩包内直接运行，也请勿从网络共享、`TEMP` 目录或系统受限目录（如 `C:\Windows`、`Program Files`）运行，否则可能无法启动或被安全软件拦截。
> - 若公司策略禁止运行一切未签名可执行文件，则仍需要管理员放行（allowlist）或使用签名构建版本。

### NoElevate 实验性诊断产物

`Bruno_zh-CN_Windows_x64_Portable_NoAdmin_NoElevate` 是在 NoAdmin 版基础上删除 `resources/elevate.exe` 的实验性诊断产物，不是推荐默认版本。删除该文件可能会禁用与 UAC 权限提升或自动更新相关的行为。如果你在当前 RDP 文件夹中 DBX 能正常启动，请将本产物解压到同一文件夹，测试 `Bruno.exe` 是否能启动，以帮助定位问题。

## 中文支持

- 默认 i18n 语言：`zh-CN`
- 英文回退语言：`en`
- Chromium / Electron 默认语言：简体中文
- Windows 构建产物带 `zh-CN` 标识
- 窗口标题标注为“Bruno 中文版”

当前已翻译现有接入 i18n 的界面。尚未接入 i18n 的页面或控件可能仍显示英文。

## 构建

中文版安装包、传统 Portable 包与 NoAdmin 免安装包均通过 GitHub Actions 构建：

1. 打开 [Build Windows Installers](https://github.com/henryZhouLikeStudy/bruno/actions/workflows/build-windows-portable.yml)。
2. 点击 **Run workflow**。
3. 构建成功后下载对应 artifact。

## 来源

来源：[usebruno/bruno](https://github.com/usebruno/bruno)
