#!/usr/bin/env node

// bin/add.js - Vue 3 项目快速生成工具
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ========== ANSI 颜色 ==========
const RESET = '\x1b[0m';
const BRIGHT = '\x1b[1m';
const DIM = '\x1b[2m';
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';

const color = {
  red: (text) => `${RED}${text}${RESET}`,
  green: (text) => `${GREEN}${text}${RESET}`,
  yellow: (text) => `${YELLOW}${text}${RESET}`,
  blue: (text) => `${BLUE}${text}${RESET}`,
  magenta: (text) => `${MAGENTA}${text}${RESET}`,
  cyan: (text) => `${CYAN}${text}${RESET}`,
  bright: (text) => `${BRIGHT}${text}${RESET}`,
  dim: (text) => `${DIM}${text}${RESET}`,
  error: (text) => `\x1b[41m\x1b[37m${text}${RESET}`, // 红底白字
};

// ========== 路径处理（ESM）==========
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = process.cwd();
const srcDir = path.join(projectRoot, 'src');

// ========== 模板管理器 ==========
const Templates = {
  vueIndex: (name) => `<template>
  <div class="${name.toLowerCase()}-container">
    <!-- ${name} 组件 -->
  </div>
</template>

<script>
export default {
  name: '${name}'
}
</script>

<style scoped>
.${name.toLowerCase()}-container {
  /* 样式 */
}
</style>
`,

  vueTest: (name) => `<template>
  <div class="test-container">
    <h2>🧪 ${name} 测试页</h2>
    <${name} />
  </div>
</template>

<script>
import ${name} from './index.vue';

export default {
  name: 'Test${name}',
  components: { ${name} }
}
</script>

<style scoped>
.test-container {
  padding: 20px;
}
</style>
`,

  pageConfig: (name) => `/**
 * ${name} 页面路由配置
 */
export default {
  path: '/${name.toLowerCase()}',
  title: '${name}',
  roles: [],
  component: () => import('./index.vue'),
  children: []
};
`,

  router: () => `import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  // 动态导入页面组件
  // { path: '/', component: () => import('@/views/Home.vue') }
];

export default createRouter({
  history: createWebHistory(),
  routes
});
`,

  pinia: () => `import { createPinia } from 'pinia';
export default createPinia();
`,

  store: (name) => {
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    return `import { defineStore } from 'pinia';

export const use${capitalized}Store = defineStore('${name}', {
  state: () => ({
    // 示例数据
    count: 0
  }),
  actions: {
    increment() {
      this.count++;
    }
  },
  getters: {
    double: (state) => state.count * 2
  }
});
`
  },

  api: (name) => `/**
 * ${name} API 接口
 */
export const ${name}Api = {
  // 示例：getList: () => axios.get('/api/${name}')
};
`,

  defaultModule: (name) => `/**
 * ${name} 模块
 */
export default {
  // 逻辑
};
`
};

// ========== 工具函数 ==========
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(color.blue(`📁 创建目录: ${path.relative(projectRoot, dirPath)}`));
    } catch (err) {
      console.error(color.red(`❌ 无法创建目录: ${dirPath}`));
      console.error(err.message);
      process.exit(1);
    }
  }
}

function writeFile(filePath, content) {
  try {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(color.green(`✅ 创建: ${path.relative(projectRoot, filePath)}`));
  } catch (err) {
    console.error(color.red(`❌ 写入文件失败: ${filePath}`));
    console.error(err.message);
    process.exit(1);
  }
}

function fileExists(filePath) {
  if (fs.existsSync(filePath)) {
    console.warn(color.yellow(`⚠️  跳过: ${path.relative(projectRoot, filePath)} 已存在`));
    return true;
  }
  return false;
}

// ========== 检查项目环境 ==========
function validateProject() {
  if (!fs.existsSync(srcDir)) {
    console.error(color.error(' ❌ 未找到 src/ 目录，请在 Vue 项目根目录运行！'));
    console.log(`   当前路径: ${projectRoot}`);
    process.exit(1);
  }
}

// ========== init 命令：注入 npm scripts ==========
function handleInit() {
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

// ========== 使用说明 ==========
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

// ========== JS 模块生成 ==========
function handleJsCommand(args) {
  const dirName = args[0].slice(3);
  if (!dirName) {
    console.error(color.red('❌ js: 后面必须指定目录名，如 js:utils'));
    process.exit(1);
  }

  const fileNames = args.slice(1);
  const targetDir = path.resolve(srcDir, dirName);
  ensureDir(targetDir);

  // 无文件名 → 生成 index.js
  if (fileNames.length === 0) {
    const indexPath = path.join(targetDir, 'index.js');
    if (fileExists(indexPath)) return;

    let content;
    if (dirName === 'router') {
      content = Templates.router();
    } else if (['store', 'stores', 'pinia'].includes(dirName)) {
      content = Templates.pinia();
    } else {
      content = Templates.defaultModule(dirName);
    }

    writeFile(indexPath, content);
    return;
  }

  // 有文件名 → 批量生成
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

// ========== Vue 组件生成（支持多级目录）==========
function handleVueComponent(args) {
  const command = args[0];
  let targetFolder = 'views';
  let relativePath = command;

  if (command.includes(':')) {
    const [folder, path] = command.split(':', 2); // 限制只分割一次
    if (!folder || !path) {
      console.error(color.red('❌ 格式错误：应为 <文件夹>:<路径>'));
      process.exit(1);
    }
    targetFolder = folder;
    relativePath = path;
  }

  // 别名映射
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

  // 拆分路径，获取组件名（最后一部分）
  const pathParts = relativePath.split('/');
  const componentName = pathParts[pathParts.length - 1];

  // 校验组件名（仅最后一部分）
  const invalidChars = /[<>:"|?*\\/\s]/; // 不允许路径符号和空格
  if (invalidChars.test(componentName) || !componentName.trim()) {
    console.error(color.red(`❌ 组件名 "${componentName}" 包含非法字符！`));
    console.log(color.yellow('仅支持: 字母、数字、中划线、下划线'));
    process.exit(1);
  }

  // 构建目标目录
  const componentDir = path.join(srcDir, targetFolder, ...pathParts);

  if (fs.existsSync(componentDir)) {
    console.error(color.red(`❌ 组件已存在: ${path.relative(projectRoot, componentDir)}`));
    process.exit(1);
  }

  ensureDir(componentDir);

  // 生成文件
  const indexPath = path.join(componentDir, 'index.vue');
  const testPath = path.join(componentDir, 'test.vue');
  const pagePath = path.join(componentDir, 'page.js');

  writeFile(indexPath, Templates.vueIndex(componentName));
  writeFile(testPath, Templates.vueTest(componentName));
  writeFile(pagePath, Templates.pageConfig(componentName));

  console.log(color.bright('\n🎉 组件创建成功！'));
  console.log(color.green(`✅ ${relativePath}`));
  console.log(color.blue(`👉 ${path.relative(projectRoot, componentDir)}`));
}

// ========== 主函数 ==========
function main() {
  validateProject();

  const args = process.argv.slice(2);

  // 支持 --help, -h, help
  if (args.some(arg => ['--help', '-h', 'help'].includes(arg))) {
    return showUsage();
  }

  // 支持 --version
  if (args.includes('--version')) {
    const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));
    console.log(color.bright(`sfc-gen v${pkg.version}`));
    process.exit(0);
  }

  if (args.length === 0) return showUsage();

  const command = args[0];

  if (command === 'init') {
    return handleInit();
  }

  if (command.startsWith('js:')) {
    return handleJsCommand(args);
  }

  handleVueComponent(args);
}

// ========== 启动 ==========
main();