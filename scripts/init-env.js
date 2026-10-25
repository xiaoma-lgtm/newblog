/**
 * 初始化 .env（不存在时创建）：
 *   node scripts/init-env.js [密码]
 * 生成随机会话密钥与管理员密码哈希（密码参数可选，默认 admin123456）。
 */
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const envPath = path.join(__dirname, "..", ".env");
if (fs.existsSync(envPath)) {
  console.error(".env 已存在，如需重置请先手动删除后重试");
  process.exit(1);
}

const password = process.argv[2] || "admin123456";
if (password.length < 6) {
  console.error("密码至少 6 位");
  process.exit(1);
}

// Next.js 加载 .env 时会做变量展开，$ 必须转义为 \$，否则 bcrypt 哈希被破坏
const hash = bcrypt.hashSync(password, 10).replace(/\$/g, "\\$");
const secret = crypto.randomBytes(32).toString("hex");

const content = `# SQLite 数据库文件（相对项目根目录）
DATABASE_URL="file:./prisma/dev.db"

# 管理员账号
ADMIN_USERNAME="admin"

# 管理员密码哈希（bcrypt）
ADMIN_PASSWORD_HASH="${hash}"

# 会话签名密钥（随机生成）
SESSION_SECRET="${secret}"
`;

fs.writeFileSync(envPath, content);
console.log("已创建 .env（管理员账号: admin，密码: 你指定的值）");
