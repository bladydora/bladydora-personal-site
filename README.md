# bladydora-personal-site

[bladydora.com](https://bladydora.com) 的源码 —— 一个个人作品展示站。

纯手写静态 HTML。没有构建步骤，没有框架，没有依赖，运行时不向任何第三方发出请求。
部署就是把文件复制到 web 根目录。

## 结构

```
index.html      首页：简介 + 精选作品
works.html      全部作品，分开发项目 / 互动实验 / AI 创作三组
about.html      关于与联系方式
404.html        找不到页面
assets/
  style.css     全部样式（含暗色模式）
  i18n.js       中英切换（约 60 行，无依赖）
  favicon.svg
```

## 本地预览

任何静态文件服务器都行，站点用的是根绝对路径（`/assets/...`），所以要从仓库根目录起服务：

```bash
python3 -m http.server 4180
# 打开 http://127.0.0.1:4180/
```

直接用 `file://` 打开会因为绝对路径而丢样式。

## 中英切换

默认中文。右上角按钮切换，选择存在 `localStorage`；也支持 `?lang=en`。

实现方式是给元素加 `data-zh` / `data-en` 两个属性，脚本按当前语言写 `textContent`。
关掉 JavaScript 时页面保持中文原样——爬虫和不跑脚本的访问者看到的是完整的中文页。

**改文案时三处要一起改**：`data-zh`、`data-en`，以及标签之间那份默认中文正文。

### ⚠️ 页脚的备案链接不要动

`.icp-link` 这个节点**刻意不带** `data-zh` / `data-en`，因此不在切换脚本的写入范围内；
`i18n.js` 里还有一道 `closest('.icp-link')` 的保险。

两条约束叠在一起：

1. 备案号在每个页面的 HTML 源码里必须**恰好出现一次**。所以不能中英各写一份页脚，只能一份 + 属性切换。
2. 曾经有个多语言脚本用 `last-child` 选择器写页脚，把备案链接整个刷掉了。别再犯。

## 部署

产物就是仓库里的这些静态文件，复制到服务器的站点根目录即可：

```bash
rsync -av --delete \
  --exclude '.git' --exclude 'README.md' --exclude '.gitignore' \
  ./ user@server:/path/to/webroot/
```

Nginx 侧只需要一个 `server_name` 精确匹配的 server 块，指向站点根目录，
并把 `error_page 404 /404.html;` 配上。具体配置与服务器信息不放在公开仓库里。

## 许可

代码（HTML / CSS / JS）随便用。文字与图片内容版权归 bladydora 所有。
