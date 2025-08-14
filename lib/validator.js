function validateProject(projectRoot, srcDir, color) {
    if (!require('fs').existsSync(srcDir)) {
        console.error(color.error(' ❌ 未找到 src/ 目录，请在 Vue 项目根目录运行！'));
        console.log(`   当前路径: ${projectRoot}`);
        process.exit(1);
    }
}

module.exports = { validateProject };