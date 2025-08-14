const fs = require('fs');      //  fs 模块
const path = require('path');  //  path 模块

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

// 检测 Vue 版本
/**
 * 检测项目中 Vue 的主版本号（vue2 或 vue3）
 *
 * 该函数读取项目根目录下的 package.json 文件，
 * 检查 dependencies 或 devDependencies 中的 vue 包版本，
 * 并根据主版本号返回 'vue2' 或 'vue3'。
 *
 * @param {string} projectRoot - 项目根目录路径（必须包含 package.json）
 * @returns {'vue2' | 'vue3'} - 返回 Vue 的主版本标识
 * @throws {Error} 当 package.json 不存在或未安装 Vue 时抛出错误
 * @author [zhy2635]
 */
function detectVueVersion(projectRoot) {
    const pkgPath = path.join(projectRoot, 'package.json');

    if (!fs.existsSync(pkgPath)) {
        throw new Error('package.json not found');
    }

    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    const vueDep = pkg.dependencies?.vue || pkg.devDependencies?.vue;

    if (!vueDep) {
        throw new Error('Vue not found in package.json');
    }

    // 移除版本前缀如 ^、~、>、>= 等
    const version = vueDep.replace(/^[\^~<>]=?\s*/g, '');
    const major = parseInt(version.split('.')[0], 10);

    return major >= 3 ? 'vue3' : 'vue2';
}

module.exports = { ensureDir, writeFile, fileExists, detectVueVersion };