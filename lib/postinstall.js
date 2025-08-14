import fs from 'fs';
import path from 'path';

const packagePath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

pkg.scripts = pkg.scripts || {};
if (!pkg.scripts.add) {
    pkg.scripts.add = "sfc";
}

fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2), 'utf8');

console.log('\x1b[32m✅ 已自动添加命令到 package.json:\x1b[0m');
console.log('  npm run add <ComponentName>');
console.log('\n💡 现在你可以直接使用这些命令了！');