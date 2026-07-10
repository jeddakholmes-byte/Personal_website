# 邱超伟 Chaowei Qiu - 个人学术主页

这是一个纯静态个人学术主页，适合放在 GitHub Pages 上。页面重点不是“展示很多炫技效果”，而是让访问者快速看清楚：我是谁、研究什么、做过哪些项目、有哪些论文或成果、如何联系我。

线上地址：

https://jeddakholmes-byte.github.io/Personal_website

## 设计思路

这次页面按学术个人主页来整理，而不是按商业产品页来做。参考了计算社会科学、公共政策、传播与数据科学方向学者主页的常见结构：

- 首屏直接呈现姓名、研究身份、关键词和核心经历。
- 导航保持简短，方便手机和电脑快速跳转。
- 研究、论文、项目分开写，避免所有内容堆在一段里。
- 论文和项目尽量写清楚方法、数据、角色和状态。
- 不写无法证实的经历，不把项目包装成夸张成果。

可参考的公开页面：

- Matthew Salganik: https://www.princeton.edu/~mjs3/
- Duncan Watts, Annenberg School: https://www.asc.upenn.edu/people/faculty/duncan-j-watts-phd

## 文件结构

```text
Personal_website/
├── index.html        # 页面内容，新增履历主要改这里
├── css/
│   └── style.css     # 页面样式、布局、响应式规则
├── js/
│   └── main.js       # 导航、滚动、摘要展开、技能条等交互
├── assets/           # 图片、PDF、头像、简历等静态文件
└── README.md         # 维护说明
```

## 本地预览

在终端进入项目目录：

```bash
cd /Users/leon/Documents/GitHub/Personal_website
python3 -m http.server 8000
```

然后打开：

```text
http://localhost:8000
```

如果 8000 端口被占用，可以换成：

```bash
python3 -m http.server 8080
```

## 修改前的基本原则

1. 先复制原文件备份，尤其是 `index.html` 和 `css/style.css`。
2. 每次只改一个部分，比如只改论文、只改项目、只改教育背景。
3. 改完后先本地预览，再推送到 GitHub。
4. 手机和电脑都要检查，尤其看标题、按钮、项目卡片有没有挤出屏幕。
5. 没有来源的经历不要写成确定事实，可以写成“进行中”“参与”“拟关注方向”。

## 如何添加教育经历

教育背景在 `index.html` 的这一段：

```html
<section class="section section-alt" id="education">
```

添加新的教育经历时，复制一个完整的 `timeline-item`：

```html
<div class="timeline-item glass-card">
  <div class="timeline-dot"></div>
  <div class="timeline-content">
    <span class="timeline-date">2026 - 2028</span>
    <h3>学校名称</h3>
    <p class="timeline-degree">专业名称 · 学位</p>
    <p class="timeline-desc">相关课程、研究方向、GPA 或重要训练</p>
  </div>
</div>
```

填写建议：

- `timeline-date` 写年份区间。
- `h3` 写学校。
- `timeline-degree` 写专业和学位。
- `timeline-desc` 写和研究方向有关的内容，不要塞太多荣誉。
- 最新经历放在最上面。

## 如何添加研究方向

研究方向在 `index.html` 的这一段：

```html
<section class="section" id="research">
```

新增方向时，在 `research-grid` 里面复制一个 `research-card`：

```html
<div class="glass-card research-card">
  <div class="research-tag">领域标签</div>
  <h3>研究方向标题</h3>
  <p>用两三句话说明问题意识、数据或方法。重点写清楚你研究什么，不要写空泛口号。</p>
  <div class="research-meta">
    <span>你的角色或项目状态</span>
    <span class="meta-sep">·</span>
    <span>进行中 / 已发表 / 已交付</span>
  </div>
</div>
```

填写建议：

- 标签尽量短，比如“公共政策”“教育数据”“行为干预”。
- 描述里最好包含对象、方法和问题。
- 如果项目没有公开数据，直接写“数据保密”。
- 如果只是计划方向，不要写成已有成果。

## 如何添加论文

论文在 `index.html` 的这一段：

```html
<section class="section section-alt" id="publications">
```

目前页面只有一篇论文。如果以后有第二篇，复制整个：

```html
<article class="glass-card pub-card">
```

然后修改这些字段：

1. `pub-number`：改成 `02`、`03`。
2. `pub-title`：中文标题和链接。
3. `pub-title-en`：英文题名，没有英文题名可以删除这一行。
4. `pub-authors`：作者列表，把自己的名字保留 `pub-author-self`。
5. `pub-affiliations`：作者单位。
6. `pub-journal`：期刊、年份、期号、栏目。
7. `pub-keywords`：关键词。
8. `pub-abstract-text`：摘要。
9. `pub-cite-text`：引用格式。
10. `pub-links`：原文链接、PDF 链接。

如果论文还没有正式发表：

- 标题可以保留。
- 期刊位置写“Working paper”或“投稿中”。
- 不要写虚构期刊名、卷期号或 DOI。
- 没有公开链接就先删除“查看原文”和“下载 PDF”按钮。

## 如何添加项目

项目在 `index.html` 的这一段：

```html
<section class="section" id="projects">
```

页面里有两类项目：

1. 大项目：`project-featured`
2. 小项目：`project-card`

### 添加大项目

适合放代表性项目，比如有在线页面、完整系统、论文关联项目。

复制一个完整的：

```html
<div class="project-featured glass-card">
```

主要修改：

- `project-featured-num`：项目编号。
- `h3`：项目名称。
- `project-subtitle`：一句话说明项目性质。
- 正文 `p`：写项目目标、对象、方法和产出。
- `project-tags`：技术或方法标签。
- `project-features`：列出 4 到 6 个具体功能或贡献。
- `project-links`：在线体验、仓库、论文或报告链接。

如果没有公开链接，可以删除 `project-links`，并在正文里写“内部项目，暂不公开”。

### 添加小项目

适合放实习项目、课程项目、分析框架、数据处理工具。

复制一个完整的：

```html
<div class="glass-card project-card">
```

主要修改：

- `project-num`：编号。
- `h3`：项目标题。
- 正文 `p`：一两句话写清楚你做了什么。
- `project-tags`：方法、工具或领域。
- `project-metrics`：最多放 3 个关键点。
- `project-status`：写“实习项目 · 暂不公开”“学术项目 · 数据保密”等。

## 如何修改技能栈

技能栈在 `index.html` 的这一段：

```html
<section class="section section-alt" id="skills">
```

每个技能是一个 `skill-item`：

```html
<div class="skill-item">
  <span class="skill-name">Python</span>
  <div class="skill-bar"><div class="skill-fill" style="width:90%"></div></div>
  <span class="skill-level">精通</span>
</div>
```

修改方法：

1. `skill-name` 写技能名。
2. `width:90%` 控制进度条长度。
3. `skill-level` 写熟练程度。

建议不要把进度条全部写成 95% 或 100%。学术主页更重要的是可信，不是显得什么都会。

可用等级：

- 熟悉
- 熟练
- 进阶
- 精通

## 如何修改联系方式

联系方式在：

```html
<section class="section" id="contact">
```

新增一个链接时，复制：

```html
<a href="链接地址" target="_blank" class="contact-link" rel="noopener">
  <svg>...</svg>
  <span>显示文字</span>
</a>
```

如果不想改 SVG 图标，可以直接复用已有图标，只改 `href` 和 `span`。

建议放：

- GitHub
- Google Scholar
- ORCID
- 个人邮箱
- 论文或项目页面
- 公开简历 PDF

如果添加邮箱，可以写：

```html
<a href="mailto:yourname@example.com" class="contact-link">
  <span>yourname@example.com</span>
</a>
```

## 如何添加头像或个人照片

现在首屏使用的是“邱”字头像。如果要换成照片：

1. 把照片放进 `assets/`，例如：

```text
assets/profile.jpg
```

2. 在 `index.html` 找到：

```html
<div class="avatar-placeholder">邱</div>
```

3. 改成：

```html
<img class="avatar-photo" src="assets/profile.jpg" alt="邱超伟 Chaowei Qiu">
```

4. 在 `css/style.css` 最后加入：

```css
.avatar-photo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--line-strong);
  box-shadow: 0 20px 50px rgba(36, 86, 111, 0.12);
}
```

照片建议：

- 正脸或半身照。
- 背景干净。
- 不要用过度修图或社交媒体滤镜。
- 文件大小尽量控制在 500KB 以内。

## 如何新增简历 PDF

1. 把 PDF 放进 `assets/`，例如：

```text
assets/Chaowei_Qiu_CV.pdf
```

2. 在首页按钮区域 `hero-links` 里新增：

```html
<a href="assets/Chaowei_Qiu_CV.pdf" target="_blank" class="hero-link" rel="noopener">
  CV
</a>
```

3. 本地预览，确认点击后能打开 PDF。

4. 推送到 GitHub 后，再在线上页面测试一次。

## 如何调整颜色和字体

颜色主要在 `css/style.css` 顶部：

```css
:root {
  --bg: #f7f4ee;
  --paper: #fffdf8;
  --ink: #1e2a2f;
  --blue: #24566f;
  --green: #427261;
  --gold: #9b6f2f;
}
```

建议只改这几个变量，不要到处单独改颜色。这样全站会保持统一。

如果想更冷静：

- `--blue` 调深一点。
- `--green` 调灰一点。
- 减少 `--gold` 的使用。

如果想更有个人特色：

- 保留纸面底色。
- 只换一个主色，不要同时换很多颜色。
- 不建议改成大面积紫色、荧光渐变或纯黑科技风。

## 手机和电脑检查清单

每次修改后检查这些点：

1. 手机宽度下导航菜单能打开和关闭。
2. 手机宽度下没有横向滚动条。
3. 首屏姓名、身份标签、按钮没有重叠。
4. 项目卡片不会被挤出屏幕。
5. 论文摘要展开和收起正常。
6. 联系方式长链接会自动换行，不会撑破页面。
7. 电脑宽屏下首屏左右结构正常。
8. 外链都能打开。
9. 没有拼写错误、错误年份、错误学校或无法证实的经历。

## 推送到 GitHub Pages

如果本机已经配置好 GitHub 认证：

```bash
cd /Users/leon/Documents/GitHub/Personal_website
git status
git add index.html css/style.css js/main.js README.md
git commit -m "Polish academic homepage"
git push
```

如果 `git push` 报认证错误，需要先处理 GitHub 登录或 SSH Key。不要反复重试同一个命令。

常见原因：

- 没有安装 Git 命令行工具。
- 没有登录 GitHub。
- SSH Key 没配置。
- HTTPS 凭据过期。

推送成功后，GitHub Pages 通常需要几十秒到几分钟更新。

## 不建议写进主页的内容

- 没有证据的实习、论文、奖项或合作单位。
- 过度夸张的形容，比如“顶尖”“革命性”“行业领先”。
- 和学术方向无关、会稀释身份的零散经历。
- 没有公开权限的数据细节。
- 不能展示的内部项目截图或敏感数据。

## 当前页面内容维护建议

短期优先补充：

1. 如果有正式 CV，放到 `assets/` 并在首屏添加 CV 按钮。
2. 如果有 Google Scholar、ORCID 或邮箱，可以加到联系方式。
3. 如果横琴政策反馈项目后续形成论文或报告，放到论文或研究方向中，不要只放在项目里。
4. 如果有个人照片，可以替换“邱”字头像，但要保持学术、干净、真实。

© 2026 邱超伟 Chaowei Qiu
