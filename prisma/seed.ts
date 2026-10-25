import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

process.loadEnvFile();

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({
    url: process.env.DATABASE_URL ?? "file:./prisma/dev.db",
    authToken: process.env.TURSO_AUTH_TOKEN || undefined,
  }),
});

async function main() {
  await prisma.post.deleteMany();

  const posts = [
    {
      title: "你好，世界！我的第一篇博客",
      summary: "博客正式上线，聊聊我为什么要写博客，以及这里会记录些什么。",
      content: `欢迎来到我的博客！

## 为什么要写博客

1. **整理知识**：写作是最好的学习方式
2. **沉淀思考**：把零散的想法串成体系
3. **分享交流**：认识更多同路人

## 这里会有什么

- 技术笔记与踩坑记录
- 读书与生活随笔
- 偶尔的胡思乱想

\`\`\`js
console.log("Hello, Blog!");
\`\`\`

希望你能在这里找到有用的东西。`,
      category: "随笔",
      tags: JSON.stringify(["随笔", "开始"]),
      status: "published",
      createdAt: new Date("2026-10-01T10:00:00"),
    },
    {
      title: "用 Next.js 搭建个人博客的完整记录",
      summary: "从零开始：技术选型、数据库设计、页面实现到部署上线，一篇讲完。",
      content: `这篇文章记录我用 **Next.js + SQLite** 搭建这个博客的完整过程。

## 技术选型

| 部分 | 选择 |
|------|------|
| 框架 | Next.js（App Router） |
| 数据库 | SQLite + Prisma |
| 样式 | Tailwind CSS |

## 为什么是 SQLite

> 个人博客的数据量，一个文件就够了。

- 零运维，不用装数据库服务
- 备份就是拷贝一个文件
- 性能完全够用

## 实现要点

1. 前台页面由服务端直接查库渲染
2. 后台增删改查走 API 接口
3. 草稿与已发布用 status 字段区分`,
      category: "技术",
      tags: JSON.stringify(["前端", "Next.js", "教程"]),
      status: "published",
      createdAt: new Date("2026-10-12T20:30:00"),
    },
    {
      title: "十月读书小结",
      summary: "这个月读了三本书，简单聊聊感受。",
      content: `十月份读了三本书，随手记录一下。

## 书单

1. **《置身事内》**：理解中国经济运行的入门佳作
2. **《黑客与画家》**：程序员视角的思考随笔
3. **《城南旧事》**：重温经典，依然动人

### 一点感想

读书不必求快，读完能留下一个想法，就值了。`,
      category: "生活",
      tags: JSON.stringify(["读书", "生活"]),
      status: "published",
      createdAt: new Date("2026-10-25T09:00:00"),
    },
    {
      title: "一篇还没写完的草稿",
      summary: "这篇只会在管理后台看到，前台不展示。",
      content: `这是用来验证草稿功能的示例文章。

前台首页不应该看到这篇。`,
      category: "",
      tags: JSON.stringify([]),
      status: "draft",
      createdAt: new Date("2026-10-24T18:00:00"),
    },
  ];

  for (const post of posts) {
    await prisma.post.create({ data: post });
  }

  const count = await prisma.post.count();
  console.log(`已写入 ${count} 篇文章（${posts.filter((p) => p.status === "published").length} 篇已发布，${posts.filter((p) => p.status === "draft").length} 篇草稿）`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
