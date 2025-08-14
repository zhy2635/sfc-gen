// templates/Templates.js

const Templates = {
  /**
   * 生成 index.vue 模板（支持 Vue 2 / Vue 3）
   * @param {string} name - 组件名
   * @param {string} version - 'vue2' 或 'vue3'
   */
  vueIndex: (name, version = 'vue3') => {
    const className = `${name.toLowerCase()}-container`;

    if (version === 'vue3') {
      return `<template>
  <div class="${className}">
    <!-- ${name} 组件 -->
  </div>
</template>

<script setup>
defineOptions({ name: '${name}' });
</script>

<style scoped>
.${className} {
  /* 样式 */
}
</style>`;
    } else {
      return `<template>
  <div class="${className}">
    <!-- ${name} 组件 -->
  </div>
</template>

<script>
export default {
  name: '${name}'
}
</script>

<style scoped>
.${className} {
  /* 样式 */
}
</style>`;
    }
  },

  /**
   * 生成 test.vue 测试页
   * @param {string} name - 组件名
   * @param {string} version - 'vue2' 或 'vue3'
   */
  vueTest: (name, version = 'vue3') => {
    if (version === 'vue3') {
      return `<template>
  <div class="test-container">
    <h2>🧪 ${name} 测试页</h2>
    <${name} />
  </div>
</template>

<script setup>
import ${name} from './index.vue';
</script>

<style scoped>
.test-container {
  padding: 20px;
}
</style>`;
    } else {
      return `<template>
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
</style>`;
    }
  },

  /**
   * 生成 page.js 路由配置（支持 Vue Router 3 / 4）
   * @param {string} name - 页面名
   * @param {string} version - 'vue2' 或 'vue3'
   */
  pageConfig: (name, version = 'vue3') => {
    const routePath = '/' + name.toLowerCase();
    const componentName = name; // 保持原名
    const componentImport = version === 'vue3'
      ? `component: () => import('./index.vue'),`
      : `component: () => import('./index.vue'),`; // Vue 2 也可用 dynamic import

    // 注意：Vue 2 + webpack 可以支持 () => import()，无需 require
    // 只有在非常老的项目中才需要 require.ensure 或 require

    return `/**
 * ${name} 页面路由配置
 * 
 * @route ${routePath}
 * @meta.title 页面标题（用于菜单、浏览器标签）
 * @meta.requiresAuth 是否需要登录验证
 * @meta.roles 可访问的角色列表
 * @meta.keepAlive 是否缓存组件实例
 */

export default {
  path: '${routePath}',
  name: '${componentName}',
  meta: {
    title: '${name}',           // 建议修改为中文或友好名称
    requiresAuth: true,         // 是否需要登录
    roles: ['admin'],           // 可访问的角色（可选）
    keepAlive: false,           // 是否缓存组件（内存换体验）
    // icon: 'icon-${name.toLowerCase()}', // 菜单图标（可选）
    // hidden: false,            // 是否在侧边栏隐藏
    // order: 99                 // 菜单排序
  },
  ${componentImport}
  // redirect: '${routePath}/list', // 可选：重定向到子页面
  children: [
    // {
    //   path: 'list',
    //   name: '${componentName}List',
    //   component: () => import('./views/List.vue'),
    //   meta: { title: '${name}列表' }
    // }
    // 添加更多子路由...
  ]
};`;
  },

  /**
   * 生成 router/index.js（Vue Router）
   * @param {string} version - 2 或 3
   */
  router: (version = 3) => {
    console.log(version);
    
    if (version === 3) {
      return `//自动导入路由
import { createRouter, createWebHistory } from 'vue-router';

const routeModules = import.meta.glob('../views/**/page.js', { eager: true });

const routes = Object.keys(routeModules)
  .map(key => {
    const module = routeModules[key];

    // ✅ 1. 检查模块是否存在
    if (!module) {
      console.error(\`[Route] 模块为空: \${ key } \`);
      return null;
    }

    // ✅ 2. 获取导出对象（优先 default）
    const config = module.default || module;

    // ✅ 3. 检查是否为对象
    if (!config || typeof config !== 'object') {
      console.error(\`[Route] 导出内容不是对象: \${ key } \`, module);
      return null;
    }

    // ✅ 4. 检查是否有 path
    if (!config.path) {
      console.error(\`[Route] 缺少 path 字段: \${ key } \`, config);
      return null;
    }

    // ✅ 5. 检查 component 是否存在
    if (!config.component) {
      console.error(\`[Route] 缺少 component 字段: \${ key } \`, config);
      return null;
    }

    console.log(\`✅ 路由加载成功: \${ config.path } -> \${ key }\`);
    return config;
  })
  .filter(Boolean); // 过滤掉 null/undefined

console.log('✅ 最终路由表:', routes);

export default createRouter({
  history: createWebHistory(),
  routes
});`;
    } else {
      return `import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

const routes = [
  // 示例
  // { path: '/', component: () => import('@/views/Home.vue') }
];

export default new VueRouter({
  mode: 'history',
  routes
});`;
    }
  },
  /**
   * 生成 pinia store 入口（仅 Vue 3 支持）
   * @param {string} version - 'vue2' 或 'vue3'
   */
  pinia: (version = 'vue3') => {
    if (version === 'vue3') {
      return `import { createPinia } from 'pinia';
export default createPinia();`;
    } else {
      return `// Pinia 不支持 Vue 2
// 建议使用 Vuex
console.warn('Pinia requires Vue 3');`;
    }
  },

  /**
   * 生成 store 模块（支持 Pinia / Vuex）
   * @param {string} name - store 名
   * @param {string} version - 'vue2' 或 'vue3'
   */
  store: (name, version = 'vue3') => {
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);

    if (version === 'vue3') {
      return `import { defineStore } from 'pinia';

export const use${capitalized}Store = defineStore('${name}', {
  state: () => ({
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
});`;
    } else {
      return `// Vuex Store for ${name}
const ${name} = {
  namespaced: true,
  state: () => ({
    count: 0
  }),
  mutations: {
    INCREMENT(state) {
      state.count++;
    }
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT');
    }
  },
  getters: {
    double: state => state.count * 2
  }
};

export default ${name};`;
    }
  },

  /**
   * 生成 API 接口文件
   * @param {string} name - 模块名
   */
  api: (name) => `/**
 * ${name} API 接口
 */
export const ${name}Api = {
  // 示例：getList: () => axios.get('/api/${name}')
};`,

  /**
   * 生成默认模块文件
   * @param {string} name - 模块名
   */
  defaultModule: (name) => `/**
 * ${name} 模块
 */
export default {
  // 逻辑
};`
};

module.exports = Templates;