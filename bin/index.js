#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

// 动态加载 lib 模块
const { validateProject } = require('../lib/validator');
const { showUsage } = require('../lib/usage');
const { handleInit } = require('../lib/init');
const { handleVueComponent } = require('../lib/vue-generator');
const { handleJsCommand } = require('../lib/js-generator');
const { color }=require('../lib/utils')


// 检测 Vue 版本
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

  const version = vueDep.replace(/^[\^~]/, '');
  const major = parseInt(version.split('.')[0], 10);

  return major >= 3 ? 'vue3' : 'vue2';
}

// 主函数
function main() {
  const projectRoot = process.cwd();
  const srcDir = path.join(projectRoot, 'src');
  const args = process.argv.slice(2); // ✅ 先定义 args

  // 显示帮助
  if (args.length === 0) {
    showUsage();
    return;
  }

  const command = args[0];

  // 处理 init 命令
  if (command === 'init') {
    handleInit(projectRoot, color);
    return;
  }

  // 验证项目结构
  validateProject(projectRoot, srcDir, color);

  // 检测 Vue 版本
  let vueVersion = 'vue3';
  try {
    vueVersion = detectVueVersion(projectRoot);
  } catch (err) {
    console.warn(color.yellow(`⚠️ 无法检测 Vue 版本，默认使用 Vue 3 模板`));
  }

  // 分发命令
  if (command.startsWith('js:')) {
    handleJsCommand(args, srcDir, color,vueVersion);
  } else {
    // ✅ 正确调用：传入 vueVersion
    handleVueComponent(args, srcDir, color, vueVersion);
  }
}

main();