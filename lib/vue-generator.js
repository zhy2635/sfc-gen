// lib/vue-generator.js
const path = require('path');
const fs = require('fs');
const Templates = require('./templates');
const { ensureDir, writeFile, fileExists } = require('./utils');

/**
 * 处理 Vue 组件生成
 * @param {string[]} args - 命令行参数，如 ['view:Dashboard']
 * @param {string} srcDir - 项目 src 目录路径
 * @param {Object} color - 颜色输出工具
 * @param {string} vueVersion - Vue 版本，'vue2' 或 'vue3'
 */
function handleVueComponent(args, srcDir, color, vueVersion) {
    let targetFolder = 'views'; // 默认生成到 views
    let relativePath = args[0];

    // 解析命令：c:Button 或 view:Dashboard
    if (args[0].includes(':')) {
        const [folder, pathStr] = args[0].split(':', 2);
        targetFolder = folder;
        relativePath = pathStr;
    }

    // 目录别名映射
    const FOLDER_ALIASES = {
        'v': 'views',
        'c': 'components',
        'com': 'components',
        'comp': 'components',
        'view': 'views',
        'component': 'components'
    };
    targetFolder = FOLDER_ALIASES[targetFolder] || targetFolder;

    if (!['views', 'components'].includes(targetFolder)) {
        console.error(color.red(`❌ 不支持的目录: ${targetFolder}`));
        console.log(color.yellow('支持: views, components 或别名 v/c/com'));
        process.exit(1);
    }

    const pathParts = relativePath.split('/');
    const componentName = pathParts[pathParts.length - 1];

    // 检查组件名合法性
    const invalidChars = /[<>:"|?*\\/\s]/;
    if (invalidChars.test(componentName) || !componentName.trim()) {
        console.error(color.red(`❌ 组件名 "${componentName}" 包含非法字符！`));
        console.log(color.yellow('仅支持: 字母、数字、中划线、下划线'));
        process.exit(1);
    }

    const componentDir = path.join(srcDir, targetFolder, ...pathParts);

    // 检查目录是否已存在
    if (fs.existsSync(componentDir)) {
        console.error(color.red(`❌ 组件已存在: ${path.relative(process.cwd(), componentDir)}`));
        process.exit(1);
    }

    ensureDir(componentDir);

    // 生成文件路径
    const indexPath = path.join(componentDir, 'index.vue');
    const testPath = path.join(componentDir, 'test.vue');
    const pagePath = path.join(componentDir, 'page.js'); // 用于路由配置

    // 写入通用文件（模板会根据 vueVersion 选择语法）
    writeFile(indexPath, Templates.vueIndex(componentName, vueVersion));
    writeFile(testPath, Templates.vueTest(componentName, vueVersion));

    // ✅ 只有 views 目录才生成 page.js（路由配置）
    if (targetFolder === 'views') {
        writeFile(pagePath, Templates.pageConfig(componentName, vueVersion));
    }

    // 成功提示
    console.log(color.bright('\n🎉 组件创建成功！'));
    console.log(color.green(`✅ ${relativePath}`));
    console.log(color.blue(`👉 ${path.relative(process.cwd(), componentDir)}`));
    if (vueVersion === 'vue2') {
        console.log(color.dim('   使用 Vue 2 模板'));
    } else {
        console.log(color.dim('   使用 Vue 3 <script setup> 模板'));
    }
}

module.exports = { handleVueComponent };