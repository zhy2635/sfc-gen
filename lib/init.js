function handleInit(projectRoot, color) {
    const fs = require('fs');
    const path = require('path');
    const pkgPath = path.join(projectRoot, 'package.json');

    if (!fs.existsSync(pkgPath)) {
        console.error(color.red('❌ 未找到 package.json'));
        process.exit(1);
    }

    let pkg;
    try {
        pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    } catch (err) {
        console.error(color.red('❌ package.json 解析失败'));
        process.exit(1);
    }

    pkg.scripts = pkg.scripts || {};
    let changed = false;

    if (!pkg.scripts.add) {
        pkg.scripts.add = 'sfc-gen';
        console.log(color.green('✅ 已添加: "add": "sfc-gen"'));
        changed = true;
    }

    if (changed) {
        try {
            fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
            console.log(color.blue('📦 package.json 已更新！'));
        } catch (err) {
            console.error(color.red('❌ 写入 package.json 失败'));
            process.exit(1);
        }
    } else {
        console.log(color.yellow('💡 脚本已存在，无需更新'));
    }

    console.log(color.bright('\n现在你可以使用：'));
    console.log('  npm run add v:admin/Dashboard');
    process.exit(0);
}

module.exports = { handleInit };