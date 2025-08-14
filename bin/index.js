#!/usr/bin/env node

const path = require('path');
const fs = require('fs');


// 动态加载 lib 模块（CommonJS）
const { validateProject } = require('../lib/validator');
const { showUsage } = require('../lib/usage');
const { handleInit } = require('../lib/init');
const { handleVueComponent } = require('../lib/vue-generator');
const { handleJsCommand } = require('../lib/js-generator');


// 路径常量
const projectRoot = process.cwd();        // 当前执行命令的目录
const srcDir = path.join(projectRoot, 'src');

// ANSI 颜色（保持原样）
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
  error: (text) => `\x1b[41m\x1b[37m${text}${RESET}`,
};

// 主逻辑
function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    showUsage();
    return;
  }

  const command = args[0];

  if (command === 'init') {
    handleInit(projectRoot, color);
    return;
  }

  validateProject(projectRoot, srcDir, color);

  if (command.startsWith('js:')) {
    handleJsCommand(args, srcDir, color);
  } else {
    handleVueComponent(args, srcDir, color);
  }
}

main();