# 邱超伟 Chaowei Qiu — 个人学术主页

> 计算社会科学 · 公共政策评估 · 行为数据分析

纯静态个人学术主页，零框架依赖，部署于 GitHub Pages。

🔗 **线上地址**：[jeddakholmes-byte.github.io/Personal_website](https://jeddakholmes-byte.github.io/Personal_website)

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 结构 | HTML5 语义化标签 |
| 样式 | CSS3 自定义属性 + 玻璃拟态（backdrop-filter） |
| 交互 | Vanilla JS（无框架、无构建工具） |
| 字体 | Lora（衬线标题）· Inter（无衬线正文）· JetBrains Mono（等宽元数据）· Noto Sans/Serif SC（中文） |
| 部署 | GitHub Pages（main 分支自动部署） |

## 功能特性

- **学术配色**：靛蓝 (#818cf8) + 青色 (#2dd4bf)，深色底 (#0a0e1a)
- **鼠标光晕**：rAF + lerp 平滑拖尾，触摸设备自动禁用
- **阅读进度条**：顶部渐变条实时跟随滚动位置
- **卡片聚光灯**：鼠标悬停时径向光斑跟随移动
- **返回顶部**：滚动超过 400px 后浮现，平滑回顶
- **滚动动画**：IntersectionObserver 驱动的渐入效果，nth-child 交错延迟
- **打字机效果**：首页身份标签循环切换
- **技能条动画**：进入视口时从 0 填充到目标宽度
- **摘要展开/收起**：max-height 过渡，跨浏览器兼容
- **响应式布局**：移动端汉堡菜单 + 自适应网格
- **无障碍**：focus-visible 键盘焦点 · aria-expanded 状态同步 · prefers-reduced-motion 降级 · Escape 关闭菜单

## 页面结构

```
01  关于我      — 计算社会科学与公共政策评估方向简介
02  教育背景    — 香港中文大学（深圳）硕士 · 华南师范大学本科
03  研究方向    — 政策反馈 · 绿色交通 · 行为助推 · 教育数据
04  发表论文    — 已发表论文详情（作者 · 期刊 · 摘要 · 关键词 · 引用格式）
05  项目作品    — MGTI 游戏人格测试 · 学生评估报告系统 · AI简历初筛 · 政策问卷分析
06  技能栈      — 编程工具 · 研究方法 · 领域知识
07  联系方式    — GitHub · 项目链接
```

## 文件结构

```
personal-website/
├── index.html      # 页面结构
├── css/
│   └── style.css   # 完整样式系统（配色 · 布局 · 动画 · 响应式）
├── js/
│   └── main.js     # 交互脚本（光晕 · 进度条 · 聚光灯 · 导航 · 动画）
├── assets/         # 静态资源
├── .gitignore
└── README.md
```

## 本地预览

```bash
cd personal-website
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```

## 部署方式

本站通过 GitHub Pages 自动部署：

1. 仓库地址：`github.com/jeddakholmes-byte/Personal_website`
2. 推送 `main` 分支后，在仓库 Settings → Pages 中启用（Source: Deploy from a branch, Branch: main / root）
3. 部署完成后访问：`https://jeddakholmes-byte.github.io/Personal_website`

## 已发表论文

- **标题**：深港跨境通勤绿色交通流动性的影响因素研究——以高铁"灵活行"政策为例
- **作者**：李嫣 · 傅承哲 · 邱超伟（第三作者）
- **期刊**：《全球ESG创新学报》2026年第1期
- **链接**：[查看原文](http://www.mohuawenpress.com/show.asp?id=503)

---

© 2026 邱超伟 Chaowei Qiu
