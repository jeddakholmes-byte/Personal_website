#!/bin/bash
# ============================================
# 个人主页一键部署脚本
# 用法：在终端运行 ./deploy.sh
# 首次使用前需先运行：gh auth login
# ============================================

cd "$(dirname "$0")" || exit 1

# 检查是否已认证
if ! gh auth status &>/dev/null; then
  echo "⚠️  还没登录 GitHub"
  echo "   请先运行: gh auth login"
  echo "   按提示选 GitHub.com → HTTPS → 浏览器授权"
  exit 1
fi

# 检查是否有待提交的改动
if git diff --quiet && git diff --cached --quiet; then
  echo "📭 没有新的改动，直接推送..."
else
  git add -A
  # 用日期作为默认提交信息，也可传入自定义信息: ./deploy.sh "我的修改"
  COMMIT_MSG="${1:-Update $(date +%Y-%m-%d)}"
  git commit -m "$COMMIT_MSG"
  echo "✅ 已提交: $COMMIT_MSG"
fi

# 推送
git push origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "🚀 推送成功！"
  echo "   网站地址: https://jeddakholmes-byte.github.io"
  echo "   GitHub Pages 会在 1-2 分钟内更新"
else
  echo ""
  echo "❌ 推送失败，请检查错误信息"
fi
