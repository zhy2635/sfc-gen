const color = {
    bright: (text) => '\x1b[1m' + text + '\x1b[0m',
    dim: (text) => '\x1b[2m' + text + '\x1b[0m',
    green: (text) => '\x1b[32m' + text + '\x1b[0m',
    cyan: (text) => '\x1b[36m' + text + '\x1b[0m',
    yellow: (text) => '\x1b[33m' + text + '\x1b[0m'
};

function showUsage() {
    console.log(color.bright('\n🚀 sfc-gen - Vue 3 快速生成工具\n'));
    console.log(color.dim('版本: 1.0.0'));

    console.log(color.green('📦 生成 Vue 组件：'));
    console.log(color.cyan('  npm run add BlogCard                   ') + color.dim('# → views/BlogCard'));
    console.log(color.cyan('  npm run add com:Button                 ') + color.dim('# → components/Button'));
    console.log(color.cyan('  npm run add v:admin/Dashboard          ') + color.dim('# 支持多级目录\n'));

    console.log(color.green('🔧 生成 JS 模块：'));
    console.log(color.cyan('  npm run add js:router                  ') + color.dim('# 生成 router/index.js'));
    console.log(color.cyan('  npm run add js:stores user auth        ') + color.dim('# 生成多个 Store'));
    console.log(color.cyan('  npm run add js:api product             ') + color.dim('# 生成 API 模块\n'));

    console.log(color.green('⚙️  初始化（首次使用）：'));
    console.log(color.cyan('  npx sfc-gen init                       ') + color.dim('# 注入 npm 脚本\n'));

    console.log(color.dim('💡 别名: v→views, c/com→components'));

    process.exit(0);
}

module.exports = { showUsage };