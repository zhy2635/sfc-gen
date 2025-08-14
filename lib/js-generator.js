const path = require('path');
const fs = require('fs');
const { ensureDir, writeFile, fileExists, detectVueVersion } = require('./utils');
const Templates = require('./templates');

// ✅ 2. 修复 handleJsCommand
function handleJsCommand(args, srcDir, color) {

    // 获取项目根目录
    const projectRoot = path.resolve(srcDir, '..');
    // 获取 Vue 版本
    const version = detectVueVersion(projectRoot); 
    const dirName = args[0].slice(3);
    if (!dirName) {
        console.error(color.red('❌ js: 后面必须指定目录名，如 js:utils'));
        process.exit(1);
    }

    const fileNames = args.slice(1);
    const targetDir = path.resolve(srcDir, dirName);
    ensureDir(targetDir);



    if (fileNames.length === 0) {
        const indexPath = path.join(targetDir, 'index.js');
        if (fileExists(indexPath)) return;

        let content;
        if (dirName === 'router') {
            console.log("✅ Vue 版本:", version); 
            content = Templates.router(version);
        } else if (['store', 'stores', 'pinia'].includes(dirName)) {
            content = Templates.pinia();
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