
<template>
  <div class="home">


    <!-- 应用网格区域 -->
    <div class="app-grid-section">
      <h3 class="section-title">应用</h3>
      <van-grid :column-num="3" :border="false" clickable>
        <van-grid-item
            v-for="app in apps"
            :key="app.id"
            :icon="app.icon"
            :text="app.name"
            @click="handleAppClick(app)"
        >
          <template #icon>
            <div class="app-icon-wrapper">
              <van-icon :name="app.icon" size="24" />
            </div>
          </template>
        </van-grid-item>
      </van-grid>
    </div>

    <!-- 推荐应用区域 -->
<!--    <div class="recommend-section">-->
<!--      <h3 class="section-title">推荐应用</h3>-->
<!--      <div class="recommend-grid">-->
<!--        <div-->
<!--            v-for="recommend in recommends"-->
<!--            :key="recommend.id"-->
<!--            class="recommend-card"-->
<!--            @click="handleRecommendClick(recommend)"-->
<!--        >-->
<!--          <div class="recommend-icon">-->
<!--            <van-icon :name="recommend.icon" size="20" />-->
<!--          </div>-->
<!--          <div class="recommend-name">{{ recommend.name }}</div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </div>-->

    <!-- 底部导航 -->
<!--    <van-tabbar v-model="activeTab" fixed placeholder>-->
<!--      <van-tabbar-item name="home" icon="home-o">首页</van-tabbar-item>-->
<!--      <van-tabbar-item name="apps" icon="apps-o">应用</van-tabbar-item>-->
<!--      <van-tabbar-item name="message" icon="chat-o" dot>消息</van-tabbar-item>-->
<!--      <van-tabbar-item name="profile" icon="user-o">我的</van-tabbar-item>-->
<!--    </van-tabbar>-->
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import router from "@/router/index.js";

const emits = defineEmits(['updateTitle']);
const activeTab = ref('home')

// 应用数据
const apps = reactive([
  { id: 1, name: 'PDF水印工具', icon: 'newspaper-o', color: '#1989fa', path: "/pdf" },
/*  { id: 2, name: '相册', icon: 'photo-o', color: '#07c160' },
  { id: 3, name: '音乐', icon: 'music-o', color: '#ff976a' },
  { id: 4, name: '视频', icon: 'video-o', color: '#ee0a24' },
  { id: 5, name: '购物', icon: 'shopping-cart-o', color: '#ff6034' },
  { id: 6, name: '游戏', icon: 'play-circle-o', color: '#7232dd' }*/
])

// 推荐应用数据
const recommends = reactive([
  { id: 1, name: '天气', icon: 'underway-o', color: '#ffd700', path: '' },
  { id: 2, name: '地图', icon: 'location-o', color: '#34c759' },
  { id: 3, name: '支付', icon: 'balance-o', color: '#00bfff' },
  { id: 4, name: '健康', icon: 'medal-o', color: '#ff6b6b' },
  { id: 5, name: '学习', icon: 'bookmark-o', color: '#9c27b0' },
  { id: 6, name: '工作', icon: 'bag-o', color: '#607d8b' }
])

// 事件处理函数
const handleAppClick = (app) => {
  if (app.path) {
    if (app.name) {
      emits("updateTitle", app.name);
    }
    router.push(app.path)
  }
}

const handleRecommendClick = (recommend) => {
  showToast(`查看${recommend.name}`)
}

const handleSearch = () => {
  showToast('搜索功能')
}

const handleSettings = () => {
  showToast('设置功能')
}
</script>

<style scoped>
.home {
  padding-bottom: 50px;
  min-height: 80vh;
}

.app-grid-section,
.recommend-section {
  padding: 16px;
  background: white;
  margin: 8px;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #323233;
  margin-bottom: 12px;
}

.app-icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.app-icon-wrapper .van-icon {
  color: white;
}

.recommend-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.recommend-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 8px;
  background: #f8f9fa;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.recommend-card:active {
  background: #e8f4ff;
  transform: scale(0.95);
}

.recommend-icon {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.recommend-name {
  font-size: 12px;
  color: #646566;
  text-align: center;
}

.van-nav-bar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.van-nav-bar :deep(.van-nav-bar__title) {
  color: white;
  font-weight: 600;
}

.van-nav-bar :deep(.van-icon) {
  color: white;
}

.van-grid-item :deep(.van-grid-item__text) {
  font-size: 12px;
  color: #323233;
}

.van-tabbar {
  border-top: 1px solid #ebedf0;
}
</style>
