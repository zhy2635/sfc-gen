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
    const importSyntax = version === 'vue3'
      ? `component: () => import('./index.vue'),`
      : `component: require('./index.vue').default,`;

    return `/**
 * ${name} 页面路由配置
 */
export default {
  path: '${routePath}',
  title: '${name}',
  roles: [],
  ${importSyntax}
  children: []
};`;
  },

  /**
   * 生成 router/index.js（Vue Router）
   * @param {string} version - 'vue2' 或 'vue3'
   */
  router: (version = 'vue3') => {
    if (version === 'vue3') {
      return `import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  // 动态导入页面组件
  // { path: '/', component: () => import('@/views/Home.vue') }
];

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