const path = require('path');
const fs = require('fs');
const { ensureDir, writeFile, fileExists } = require('./utils');
const Templates = require('./templates');

// ✅ 1. 添加：获取 Vue 主版本号
function getVueVersion(projectRoot) {
    try {
        const pkgPath = path.join(projectRoot, 'package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

        const deps = {
            ...pkg.dependencies,
            ...pkg.devDependencies
        };

        const vueVersion = deps['vue'];
        if (!vueVersion) {
            console.warn('⚠️ package.json 中未找到 vue 依赖，默认使用 Vue 3');
            return 3;
        }

        // 匹配主版本号：如 "3.x.x", "^2.7.0", "~3.4.0" -> 提取 3 或 2
        const match = vueVersion.match(/[^0-9]*(\d+)/);
        const version = match ? parseInt(match[1]) : 3;

        if (version === 2 || version === 3) {
            return version;
        } else {
            console.warn(`⚠️ 未知 Vue 版本 ${version}，默认使用 Vue 3`);
            return 3;
        }
    } catch (e) {
        console.warn('⚠️ 无法读取 package.json，使用默认 Vue 3');
        return 3;
    }
}

// ✅ 2. 修复 handleJsCommand
function handleJsCommand(args, srcDir, color) {
    const dirName = args[0].slice(3);
    if (!dirName) {
        console.error(color.red('❌ js: 后面必须指定目录名，如 js:utils'));
        process.exit(1);
    }

    const fileNames = args.slice(1);
    const targetDir = path.resolve(srcDir, dirName);
    ensureDir(targetDir);

    // ✅ 获取项目根目录（假设 srcDir 是 src/）
    const projectRoot = path.resolve(srcDir, '..');

    // ✅ 获取 Vue 版本
    const version = getVueVersion(projectRoot); // ✅ 这里定义了 version！

    if (fileNames.length === 0) {
        const indexPath = path.join(targetDir, 'index.js');
        if (fileExists(indexPath)) return;

        let content;
        if (dirName === 'router') {
            console.log("✅ Vue 版本:", version); // ✅ 现在可以打印了
            content = Templates.router(version);  // ✅ 传给模板
        } else if (['store', 'stores', 'pinia'].includes(dirName)) {
            content = Templates.pinia(); // 也可以传 version
        } else {
            content = Templates.defaultModule(dirName);
        }

        writeFile(indexPath, content);
        return;
    }

    fileNames.forEach(name => {
        const filePath = path.join(targetDir, `${name}.js`);
        if (fileExists(filePath)) return;

        let content;
        if (['store', 'stores'].includes(dirName)) {
            content = Templates.store(name);
        } else if (dirName === 'api') {
            content = Templates.api(name);
        } else {
            content = Templates.defaultModule(name);
        }

        writeFile(filePath, content);
    });
}

module.exports = { handleJsCommand };