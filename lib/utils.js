/**
 * 工具函数模块：提供文件系统操作、版本检测和控制台颜色输出功能
 * 
 * @module utils
 * @author zhy2635
 * @version 1.0.0
 */

const fs = require('fs');      // Node.js 文件系统模块
const path = require('path');  // Node.js 路径处理模块

/**
 * 确保目录存在，如果不存在则递归创建
 * 
 * @param {string} dirPath - 要确保存在的目录路径（绝对或相对路径）
 * @example
 * ensureDir('./src/components');
 * // 输出: 📁 创建目录: src/components
 * @throws {Error} 当目录创建失败时终止进程
 */
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

/**
 * 将内容写入指定文件，自动创建目录（如需要）
 * 
 * @param {string} filePath - 目标文件的完整路径
 * @param {string} content - 要写入的文件内容（UTF-8 编码）
 * @example
 * writeFile('./src/main.js', 'console.log("Hello");');
 * // 输出: ✅ 创建: src/main.js
 * @throws {Error} 当文件写入失败时终止进程
 */
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

/**
 * 检查文件是否存在，若存在则打印警告并返回 true
 * 
 * @param {string} filePath - 要检查的文件路径
 * @returns {boolean} 如果文件存在返回 true，否则返回 false
 * @example
 * if (!fileExists('./src/router/index.js')) {
 *   // 安全创建新文件
 * }
 * // 若文件存在: ⚠️  跳过: src/router/index.js 已存在
 */
function fileExists(filePath) {
    if (fs.existsSync(filePath)) {
        console.warn(`⚠️  跳过: ${path.relative(process.cwd(), filePath)} 已存在`);
        return true;
    }
    return false;
}

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
 * @example
 * const version = detectVueVersion('/path/to/project');
 * console.log(version); // 'vue3'
 * @author zhy2635
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

/**
 * 颜色化输出工具对象，用于在终端中显示彩色文本
 * 
 * @namespace color
 * @property {Function} red - 红色文本
 * @property {Function} green - 绿色文本  
 * @property {Function} yellow - 黄色文本
 * @property {Function} blue - 蓝色文本
 * @property {Function} magenta - 品红色文本
 * @property {Function} cyan - 青色文本
 * @property {Function} bright - 亮色文本
 * @property {Function} dim - 暗色文本
 * @property {Function} error - 白底红字错误样式
 * 
 * @example
 * console.log(color.red('操作失败！'));
 * console.log(color.green('操作成功！'));
 */
const color = {
    red: (text) => `${'\x1b[31m'}${text}${'\x1b[0m'}`,
    green: (text) => `${'\x1b[32m'}${text}${'\x1b[0m'}`,
    yellow: (text) => `${'\x1b[33m'}${text}${'\x1b[0m'}`,
    blue: (text) => `${'\x1b[34m'}${text}${'\x1b[0m'}`,
    magenta: (text) => `${'\x1b[35m'}${text}${'\x1b[0m'}`,
    cyan: (text) => `${'\x1b[36m'}${text}${'\x1b[0m'}`,
    bright: (text) => `${'\x1b[1m'}${text}${'\x1b[0m'}`,
    dim: (text) => `${'\x1b[2m'}${text}${'\x1b[0m'}`,
    error: (text) => `\x1b[41m\x1b[37m${text}\x1b[0m`,
};

// 导出所有工具函数和颜色工具
module.exports = {
    ensureDir,
    writeFile,
    fileExists,
    detectVueVersion,
    color
};