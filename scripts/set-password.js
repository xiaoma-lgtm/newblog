/**
 * 修改管理员密码：
 *   node scripts/set-password.js 新密码
 * 生成 bcrypt 哈希并更新 .env 中的 ADMIN_PASSWORD_HASH，然后重启开发服务器生效。
 */
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");

const password = process.argv[2];
if (!password) {
  console.error("用法: node scripts/set-password.js <新密码>");
  process.exit(1);
}
if (password.length < 6) {
  console.error("密码至少 6 位");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
const envPath = path.join(__dirname, "..", ".env");
let content = fs.readFileSync(envPath, "utf8");
// Next.js 加载 .env 时会做变量展开，$ 必须转义为 \$，否则哈希被破坏
const line = `ADMIN_PASSWORD_HASH="${hash.replace(/\$/g, "\\$")}"`;

if (/^ADMIN_PASSWORD_HASH=.*$/m.test(content)) {
  content = content.replace(/^ADMIN_PASSWORD_HASH=.*$/m, line);
} else {
  content += `\n${line}\n`;
}
fs.writeFileSync(envPath, content);
console.log("已更新 .env 中的 ADMIN_PASSWORD_HASH，重启 dev server 后生效");
