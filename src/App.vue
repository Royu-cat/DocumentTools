<template>
  <van-config-provider :theme="theme">
    <!-- 顶部导航栏 -->
    <van-nav-bar
        :title="title"
        fixed
        placeholder
        :border="false"
        safe-area-inset-top
    >
      <template #right>
        <!--        <van-icon name="search" size="18" @click="handleSearch" />-->
        <!--        <van-icon name="setting-o" size="18" style="margin-left: 12px;" @click="handleSettings" />-->
      </template>
    </van-nav-bar>
    <RouterView />
  </van-config-provider>
</template>

<script setup>
import {onBeforeRouteUpdate, RouterLink, RouterView} from 'vue-router'
import {onMounted, reactive, ref, watch} from "vue";
import router from "@/router/index.js";

const theme = ref('light')
const title = ref("工具")
onMounted(() => {
  updateTitle();
})

watch(router.currentRoute, (value) => {
  title.value = router && router.currentRoute.value && router.currentRoute.value.meta && router.currentRoute.value.meta.title;
}, {
  deep: true,
  immediate: true
});

const updateTitle = () => {
  setTimeout(() => {
    title.value = router && router.currentRoute.value && router.currentRoute.value.meta && router.currentRoute.value.meta.title;
  }, 200);
}
</script>
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: #f7f8fa;
  min-height: 100vh;
}
</style>
