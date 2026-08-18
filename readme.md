<br />
<img src="assets/images/logo-transparent.png" width="80"/>

### Bruno - 开源 IDE，用于探索和测试 API。

[![中文版构建](https://github.com/henryZhouLikeStudy/bruno/actions/workflows/build-windows-portable.yml/badge.svg?branch=main)](https://github.com/henryZhouLikeStudy/bruno/actions/workflows/build-windows-portable.yml)
[![提交活动](https://img.shields.io/github/commit-activity/m/henryZhouLikeStudy/bruno)](https://github.com/henryZhouLikeStudy/bruno/pulse)
[![X](https://img.shields.io/twitter/follow/use_bruno?style=social&logo=x)](https://twitter.com/use_bruno)
[![网站](https://img.shields.io/badge/Website-Visit-blue)](https://www.usebruno.com)
[![下载中文版](https://img.shields.io/badge/下载-中文版-brightgreen)](https://github.com/henryZhouLikeStudy/bruno/actions/workflows/build-windows-portable.yml)

[English](https://github.com/usebruno/bruno/blob/main/readme.md)
| [Українська](docs/readme/readme_ua.md)
| [Русский](docs/readme/readme_ru.md)
| [Türkçe](docs/readme/readme_tr.md)
| [Deutsch](docs/readme/readme_de.md)
| [Français](docs/readme/readme_fr.md)
| [Português (BR)](docs/readme/readme_pt_br.md)
| [한국어](docs/readme/readme_kr.md)
| [বাংলা](docs/readme/readme_bn.md)
| [Español](docs/readme/readme_es.md)
| [Italiano](docs/readme/readme_it.md)
| [Română](docs/readme/readme_ro.md)
| [Polski](docs/readme/readme_pl.md)
| **简体中文**
| [正體中文](docs/readme/readme_zhtw.md)
| [العربية](docs/readme/readme_ar.md)
| [日本語](docs/readme/readme_ja.md)
| [ქართული](docs/readme/readme_ka.md)

> **Bruno 中文版（简体中文默认版）：** 此 fork 默认使用简体中文（`zh-CN`），Windows 安装版和 Portable 构建产物带 `zh-CN` 标识。当前已翻译现有接入 i18n 的界面；尚未接入 i18n 的页面或控件可能仍显示英文。

Bruno 是一款全新且创新的 API 客户端，旨在颠覆 Postman 和其他类似工具。

Bruno 直接在您的电脑文件夹中存储您的 API 信息。我们使用纯文本标记语言 Bru 来保存有关 API 的信息。

您可以使用 Git 或您选择的任何版本控制系统来对您的 API 信息进行版本控制和协作。

Bruno 仅限离线使用。我们计划永不向 Bruno 添加云同步功能。我们重视您的数据隐私，并认为它应该留在您的设备上。阅读我们的长期愿景 [点击查看](https://github.com/usebruno/bruno/discussions/269)

[下载 Bruno](https://www.usebruno.com/downloads)

📢 观看我们在印度 FOSS 3.0 会议上的最新演讲 [点击查看](https://www.youtube.com/watch?v=7bSMFpbcPiY)

![bruno](assets/images/landing-2.png) <br /><br />

## 商业版本 ✨

我们的大多数功能都是免费且开源的。
我们致力于在 [开源与可持续性发展](https://github.com/usebruno/bruno/discussions/269) 之间取得和谐的平衡

欢迎使用我们的 [付费版本](https://www.usebruno.com/pricing) ，看看附加的功能是否对您或团队有所帮助！ <br/>

## 目录
- [安装](#安装)
- [特性](#特性)
    - [跨平台使用 🖥️](#跨平台使用-)
    - [通过Git协作 👩‍💻🧑‍💻](#通过git协作-)
- [重要链接 📌](#重要链接-)
- [展示 🎥](#展示-)
- [分享评价 📣](#分享评价-)
- [发布到新的包管理器](#发布到新的包管理器)
- [联系方式 🌐](#联系方式-)
- [商标](#商标)
- [贡献 👩‍💻🧑‍💻](#贡献-)
- [作者](#作者)
- [许可证 📄](#许可证-)

## 安装

Bruno 可以在我们的 [网站上下载](https://www.usebruno.com/downloads) 适用于Mac、Windows 和 Linux 的可执行文件。

您也可以通过包管理器如 Homebrew、Chocolatey、Scoop、Snap 和 Apt 安装 Bruno。

```sh
# 在 Mac 电脑上用 Homebrew 安装
brew install bruno

# 在 Windows 上用 Chocolatey 安装
choco install bruno

# 在 Windows 上用 Scoop 安装
scoop bucket add extras
scoop install bruno

# 在 Windows 上用 winget 安装
winget install Bruno.Bruno

# 在 Linux 上用 Snap 安装
snap install bruno

# 在 Linux 上用 Flatpak 安装
flatpak install com.usebruno.Bruno

# 在 Linux 上用 Apt 安装
sudo mkdir -p /etc/apt/keyrings
sudo apt update && sudo apt install gpg curl
curl -fsSL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x9FA6017ECABE0266" \
  | gpg --dearmor \
  | sudo tee /etc/apt/keyrings/bruno.gpg > /dev/null
sudo chmod 644 /etc/apt/keyrings/bruno.gpg
echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/bruno.gpg] http://debian.usebruno.com/ bruno stable" \
  | sudo tee /etc/apt/sources.list.d/bruno.list
sudo apt update && sudo apt install bruno
```

## 特性

### 跨平台使用 🖥️

![bruno](assets/images/run-anywhere.png) <br /><br />

### 通过Git协作 👩‍💻🧑‍💻

或者任何您选择的版本控制系统

![bruno](assets/images/version-control.png) <br /><br />

## 重要链接 📌

- [我们的愿景](https://github.com/usebruno/bruno/discussions/269)
- [路线图](https://www.usebruno.com/roadmap)
- [文档](https://docs.usebruno.com)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/bruno)
- [网站](https://www.usebruno.com)
- [价格](https://www.usebruno.com/pricing)
- [下载](https://www.usebruno.com/downloads)

## 展示 🎥

- [Testimonials](https://github.com/usebruno/bruno/discussions/343)
- [Knowledge Hub](https://github.com/usebruno/bruno/discussions/386)
- [Scriptmania](https://github.com/usebruno/bruno/discussions/385)

## 分享评价 📣

如果 Bruno 在您的工作和团队中帮助了您，请不要忘记在我们的 GitHub 讨论上分享您的 [评价](https://github.com/usebruno/bruno/discussions/343)

## 发布到新的包管理器

如需了解更多信息，请参见 [此处](docs/publishing/publishing_cn.md) 。

## 联系方式 🌐

[𝕏 (Twitter)](https://twitter.com/use_bruno) <br />
[Website](https://www.usebruno.com) <br />
[Discord](https://discord.com/invite/KgcZUncpjq) <br />
[LinkedIn](https://www.linkedin.com/company/usebruno)

## 商标

**名称**

`Bruno` 是由 [Anoop M D](https://www.helloanoop.com/) 持有的商标。

**Logo**

Logo 源自 [OpenMoji](https://openmoji.org/library/emoji-1F436/). License: CC [BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)

## 贡献 👩‍💻🧑‍💻

很高兴您希望改进 bruno。请查看 [贡献指南](docs/contributing/contributing_cn.md)。

即使您无法通过代码做出贡献，我们仍然欢迎您提出 BUG 和新的功能需求。

## 作者

<div align="center">
    <a href="https://github.com/usebruno/bruno/graphs/contributors">
        <img src="https://contrib.rocks/image?repo=usebruno/bruno" />
    </a>
</div>

## 许可证 📄

[MIT](license.md)
