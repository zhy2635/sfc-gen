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

module.exports = Templates;