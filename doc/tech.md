# 个人博客系统 技术方案（Tech Design）

> 本文档为实现指引，配合 `doc/prd.md`（产品需求）一起交给 Claude Code 实施；若与 PRD 冲突，以 PRD 为准。

## 1. 技术选型

| 用途 | 选型 | 说明 |
|------|------|------|
| 框架 | Next.js（App Router）+ TypeScript | 页面与接口同项目同进程，部署简单 |
| 数据库 | SQLite + Prisma | 数据存为单文件 `blog.db`，免运维；Prisma 负责建模与查询 |
| 样式 | Tailwind CSS | 原子化类名，快速实现响应式 |
| 文章渲染 | react-markdown | 前台将 Markdown 渲染为 HTML |
| 登录认证 | bcryptjs + Cookie 会话 | 密码仅存哈希；登录后下发会话 Cookie |
| 管理员凭据 | `.env` 环境变量 | 单管理员场景，不单独建用户表 |

## 2. 架构规范

三层分工：

1. **页面层**（`app/**/page.tsx`）：负责界面呈现，不直接访问数据库
2. **数据层**（`lib/`）：封装全部读写库函数，供页面与接口调用
3. **接口层**（`app/api/`）：后台增删改查走接口；前台页面由服务端直接查库渲染

## 3. 项目目录结构

```
myblog/
├── doc/
│   ├── prd.md                 # 产品需求
│   └── tech.md                # 技术方案（本文档）
├── prisma/schema.prisma       # 数据库表结构定义
├── .env                       # 管理员账号、密码哈希、会话密钥
├── src/
│   ├── app/
│   │   ├── layout.tsx         # 前台整体框架（导航 + 页脚）
│   │   ├── page.tsx           # 首页：文章列表 + 分页
│   │   ├── post/[id]/page.tsx # 文章详情
│   │   ├── about/page.tsx     # 关于我
│   │   ├── admin/
│   │   │   ├── login/page.tsx     # 登录页
│   │   │   ├── layout.tsx         # 后台框架（侧边栏 + 登录拦截）
│   │   │   ├── page.tsx           # 仪表盘（统计）
│   │   │   └── posts/
│   │   │       ├── page.tsx           # 文章列表（表格 + 删除）
│   │   │       ├── new/page.tsx       # 新增文章表单
│   │   │       └── [id]/edit/page.tsx # 编辑文章表单
│   │   └── api/
│   │       ├── auth/login/route.ts
│   │       ├── auth/logout/route.ts
│   │       └── posts/route.ts + posts/[id]/route.ts
│   ├── components/            # 复用组件：文章卡片、分页器、统计卡片
│   ├── lib/                   # 工具：db 连接、登录校验、Markdown 渲染
│   └── middleware.ts          # 后台路由守卫
└── package.json
```

## 4. 路由设计（含接口与权限）

页面路由：

| 页面 | 路由 | 访问权限 |
|------|------|---------|
| 首页 | `/` | 公开 |
| 文章详情 | `/post/:id` | 公开（草稿返回 404） |
| 关于我 | `/about` | 公开 |
| 后台登录 | `/admin/login` | 公开（已登录跳仪表盘） |
| 仪表盘 | `/admin` | 仅管理员 |
| 文章列表 | `/admin/posts` | 仅管理员 |
| 新增文章 | `/admin/posts/new` | 仅管理员 |
| 编辑文章 | `/admin/posts/:id/edit` | 仅管理员 |

接口路由（后台专用）：

| 方法 | 路由 | 说明 | 访问权限 |
|------|------|------|---------|
| POST | `/api/auth/login` | 登录 | 公开 |
| POST | `/api/auth/logout` | 退出 | 仅已登录 |
| GET | `/api/posts` | 后台列表（含草稿） | 仅管理员 |
| POST | `/api/posts` | 新增 | 仅管理员 |
| PUT | `/api/posts/:id` | 编辑 | 仅管理员 |
| DELETE | `/api/posts/:id` | 删除 | 仅管理员 |

> **404 状态码补充**（Next 16 行为）：流式渲染开始后调用 `notFound()` 状态码会保持 200（仅注入 noindex）。
> 为保证「草稿/不存在文章返回真 404」，`src/proxy.ts` 在渲染前用只读 SQLite 连接（`node:sqlite`）
> 检查 `/post/:id` 的发布状态，未发布则重写到未匹配路径，由根级 `app/not-found.tsx` 返回 404 页面。
> 页面内 `notFound()` 保留作为客户端导航的兜底 UI。

## 5. 数据库 Schema（Prisma）

```prisma
model Post {
  id        Int      @id @default(autoincrement())
  title     String
  summary   String   @default("")
  content   String                  // Markdown 原文
  category  String   @default("")
  tags      String   @default("[]") // JSON 字符串数组
  status    String   @default("draft") // draft | published
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

- 前台查询一律加 `status = "published"`
- 初始化种子数据：2~3 条示例文章

## 6. 实现步骤

1. 初始化项目：Next.js + TypeScript + Tailwind + Prisma，跑通空页面
2. 建数据库：定义 Post 模型，生成 SQLite 文件，写入示例文章
3. 做前台：首页列表 + 分页 → 详情页 Markdown 渲染 → 关于我
4. 做登录：登录页、bcrypt 校验、会话 Cookie、后台中间件拦截
5. 做后台功能：仪表盘统计 → 文章列表 → 新增/编辑表单 → 删除二次确认
6. 响应式收尾：手机端汉堡菜单、表格适配，按 PRD 第 3 章验收标准逐条核对
7. 构建验证：`npm run build` + 生产模式全流程自测

## 7. 部署方案

- SQLite 为文件数据库，需部署在文件持久的常驻机器上（不推荐 Vercel 等无服务器平台）
- 推荐方式（二选一）：
  - **简单版**：云服务器安装 Node.js，`npm run build && npm start`，用 PM2 常驻
  - **规范版**：Docker 镜像 + `-v` 挂载 `blog.db` 数据卷
- 配套：Nginx/Caddy 反向代理 + 域名 + HTTPS；备份即拷贝 `blog.db`
