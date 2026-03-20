<template>
  <div class="bottom-nav">
    <div 
      class="nav-item" 
      :class="{ active: $route.path === '/' }"
      @click="$router.push('/')"
    >
      <div class="nav-icon">🏠</div>
      <span>首页</span>
    </div>
    <div 
      class="nav-item" 
      :class="{ active: $route.path === '/profile' }"
      @click="$router.push('/profile')"
    >
      <div class="nav-icon">🏘️</div>
      <span>概况</span>
    </div>
    <div 
      class="nav-item" 
      :class="{ active: $route.path === '/news' }"
      @click="$router.push('/news')"
    >
      <div class="nav-icon">📰</div>
      <span>新闻</span>
    </div>
    <div 
      class="nav-item" 
      :class="{ active: $route.path === '/service' }"
      @click="$router.push('/service')"
    >
      <div class="nav-icon">🛠️</div>
      <span>服务</span>
    </div>
    <div 
      class="nav-item" 
      :class="{ active: $route.path === '/contact' }"
      @click="$router.push('/contact')"
    >
      <div class="nav-icon">📍</div>
      <span>联系</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BottomNav'
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: white;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  padding: 8px 0;
  padding-bottom: calc(8px + env(safe-area-inset-bottom));
  z-index: 1000;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px;
  cursor: pointer;
  transition: all 0.2s;
}

.nav-item:active {
  opacity: 0.6;
}

.nav-icon {
  font-size: 24px;
  margin-bottom: 4px;
}

.nav-item span {
  font-size: 12px;
  color: #666;
}

.nav-item.active span {
  color: #4CAF50;
  font-weight: 500;
}
</style>
