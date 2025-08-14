const fs = require('path');
const path = require('path');

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        try {
            fs.mkdirSync(dirPath, { recursive: true });
            console.log(`📁 创建目录: ${path.relative(process.cwd(), dirPath)}`);
        } catch (err) {
            console.error(`❌ 无法创建目录: ${dirPath}`);
            console.error(err.message);
            process.exit(1);
        }
    }
}

function writeFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ 创建: ${path.relative(process.cwd(), filePath)}`);
    } catch (err) {
        console.error(`❌ 写入文件失败: ${filePath}`);
        console.error(err.message);
        process.exit(1);
    }
}

function fileExists(filePath) {
    if (fs.existsSync(filePath)) {
        console.warn(`⚠️  跳过: ${path.relative(process.cwd(), filePath)} 已存在`);
        return true;
    }
    return false;
}

module.exports = { ensureDir, writeFile, fileExists };