# MyBlog · 个人博客系统

基于 Next.js + SQLite 的个人博客，包含读者前台与博主管理后台，开箱即用。

## 功能特性

- **前台**：首页（文章列表 + 分页）、文章详情（Markdown 渲染）、关于我
- **后台**：管理员登录、仪表盘（文章统计）、文章管理（列表 / 新增 / 编辑 / 删除）
- **草稿隔离**：草稿对前台完全不可见，直接访问链接也返回 404
- **响应式**：前台适配手机 / 平板 / 桌面，手机端导航折叠为汉堡菜单
- **安全**：bcrypt 密码哈希、JWT 会话 Cookie、后台页面与接口双重鉴权、删除二次确认

## 技术栈

| 用途 | 选型 |
|------|------|
| 框架 | Next.js 16（App Router）+ TypeScript |
| 数据库 | SQLite + Prisma 7（libSQL 驱动适配器） |
| 样式 | Tailwind CSS 4（含 typography 排版插件） |
| 文章渲染 | react-markdown + remark-gfm |
| 登录认证 | bcryptjs + jose（JWT 会话） |

## 快速开始

环境要求：Node.js ≥ 20（推荐 24 LTS）

```bash
# 1. 安装依赖
npm install

# 2. 初始化 .env（生成管理员密码哈希和会话密钥，密码参数可选，默认 admin123456）
node scripts/init-env.js 你的密码

# 3. 建表并写入示例数据
npx prisma db push
npx prisma db seed

# 4. 启动开发服务器
npm run dev
```

打开 http://localhost:3000 查看前台，http://localhost:3000/admin 登录后台。

## 修改管理员密码

```bash
node scripts/set-password.js 新密码
```

修改后重启 dev server 生效。

## 常用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发模式 |
| `npm run build` | 生产构建 |
| `npm start` | 生产模式启动 |
| `npm run db:push` | 同步数据库结构 |
| `npm run db:seed` | 重置并写入示例文章 |
| `node scripts/set-password.js <密码>` | 修改管理员密码 |

## 项目结构

```
doc/                     # prd.md 产品需求、tech.md 技术方案
prisma/                  # 数据库 Schema、种子数据、SQLite 文件
scripts/                 # 环境初始化、密码修改脚本
src/
├── app/
│   ├── (public)/        # 前台：首页、文章详情、关于我、404
│   ├── admin/           # 后台：登录、仪表盘、文章管理
│   └── api/             # 接口：登录/退出、文章增删改查
├── components/          # 复用组件（前台 + 后台）
├── lib/                 # 数据访问、会话认证
└── proxy.ts             # 后台路由守卫
```

## 文档

- `doc/prd.md` — 产品需求文档（功能、权限、验收标准）
- `doc/tech.md` — 技术方案（选型、架构、路由、Schema、部署）

## 部署

### 云端（推荐）：Vercel + Turso，免费

本地 SQLite 文件不适合无服务器平台（文件系统临时），云端改用 libSQL 云数据库 Turso，代码按 `DATABASE_URL` 自动区分本地/云端：

1. 注册 [Turso](https://turso.tech)，创建数据库，把连接串和认证 token 写入本地 `.env.turso`（已 gitignore）
2. `npx tsx scripts/init-remote-db.ts` 建表；注入同样环境变量后 `npx prisma db seed` 写示例文章
3. 注册 [Vercel](https://vercel.com)，Import GitHub 仓库，配置生产环境变量：

| 变量 | 值 |
|------|-----|
| `DATABASE_URL` | Turso 连接串（`libsql://...`） |
| `TURSO_AUTH_TOKEN` | Turso 认证 token |
| `ADMIN_USERNAME` | 管理员账号 |
| `ADMIN_PASSWORD_HASH` | bcrypt 密码哈希（`node scripts/set-password.js` 生成后取 `.env` 里的值） |
| `SESSION_SECRET` | 随机 64 位十六进制（本地 `.env` 里的值） |

4. Deploy 后即可访问；推送 GitHub 自动重新部署

### 自托管

SQLite 为文件数据库，需部署在文件持久的常驻机器上。详见 `doc/tech.md` 第 7 节：

- **简单版**：云服务器安装 Node.js，`npm run build && npm start`，PM2 常驻
- **规范版**：Docker 镜像 + 挂载数据库文件卷
- 备份即拷贝 `prisma/dev.db` 一个文件
