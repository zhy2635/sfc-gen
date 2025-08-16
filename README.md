# 🚀 sfc-gen - Vue 项目快速生成工具

**一键生成标准化代码结构，提升 300% 开发效率**
专为 Vue 设计，支持组件/页面/Store/API 等 10+ 文件类型自动生成，内置团队规范校验。

------

## 🌟 核心特性

- 🎯 **智能生成**：Vue SFC / Pinia Store / Router / API 等全类型支持
- ⚡ **极速上手**：别名简写 + 交互式命令行
- 🛠 **灵活扩展**：自定义模板/语法（支持 `<script setup>`）
- 📂 **规范统一**：自动创建配套测试页和路由配置
- 🔥 **零依赖**：30KB 轻量级，Node.js 原生实现

------

## 🚀 快速开始

### 1. 安装

```bash
# 全局安装（推荐）
npm install -g sfc-gen
 
# 或本地安装到项目
npm install sfc-gen --save-dev
```

### 2. 初始化配置（可选）

```bash
npx sfc-gen init
# 自动添加 package.json 脚本：
# { "scripts": { "add": "sfc-gen" } }
# 也可自行添加
```

### 3. 生成你的第一个文件

```bash
# 生成组件（默认 views/ 目录）
npm run add Card
 
# 使用别名（支持多级目录）
npm run add v:admin/Dashboard
npm run add c:ui/Button
 
# 生成 JS 模块
npm run add js:stores/user
npm run add js:api/product
 
# 查看帮助
npm run add
```

------

## 📚 详细用法

### 🎨 Vue 组件生成



| 命令                            | 生成位置                     | 包含文件                     |
| ------------------------------- | ---------------------------- | ---------------------------- |
| `npm run add Card`              | `src/views/Card/`            | index.vue, test.vue, page.js |
| `npm run add c:Button`          | `src/components/Button/`     | 同上                         |
| `npm run add v:admin/Dashboard` | `src/views/admin/Dashboard/` | 同上                         |



**自动生成结构示例**：

```
src/views/Card/
├── index.vue     # 主组件（含 Options API 模板）
├── test.vue      # 预览页（带实时渲染）
└── page.js       # 路由配置（懒加载）
```

### ⚙️ JS 模块生成

```bash
# 单文件生成
npm run add js:router
 
# 多文件生成（自动创建目录）
npm run add js:stores/user auth setting
 
# 输出示例
src/stores/
├── user.js       # Pinia Store 模板
├── auth.js       # 带持久化示例
└── setting.js    # 带 getter/action
```

### 🔖 别名速查



| 别名           | 目标目录          |
| -------------- | ----------------- |
| `v:` / `view:` | `src/views/`      |
| `c:` / `com:`  | `src/components/` |
| `js:`          | `src/`            |



------

## 🛠 高级配置

### 自定义模板

1. Fork 项目后修改 `src/templates/` 目录
2. 支持覆盖以下模板：
   - `vueComponent.ejs` (主组件)
   - `piniaStore.ejs` (状态管理)
   - `apiModule.ejs` (接口文件)

### 命令行参数

```bash
# 强制覆盖已存在文件
npm run add Card --force
 
# 使用 TypeScript 模板
npm run add Card --ts
 
# 生成 Composition API 风格
npm run add Card --setup
```

------

## 📄 生成文件说明



| 文件        | 用途                                       |
| ----------- | ------------------------------------------ |
| `index.vue` | 主组件文件（支持 Options/Composition API） |
| `test.vue`  | 预览测试页（集成 Vite 实时渲染）           |
| `page.js`   | 路由配置（自动懒加载）                     |
| `store.js`  | Pinia Store（含 state/actions/getters）    |
| `api.js`    | API 接口（axios 封装示例）                 |



------

## 🤝 贡献指南

1. **提交 Issue**：bug 反馈 / 功能建议

2. Pull Request

   ：

   - 模板改进
   - 新功能实现
   - 文档优化

3. 联系作者

   ：

   - Email: [guochang2635@icloud.com](mailto:your.email@example.com)
   - GitHub: [@zhy2635](https://github.com/your-username/sfc-gen)

------

## 📜 许可证

[MIT License](https://opensource.org/licenses/MIT)
© 2023 sfc-gen Contributors