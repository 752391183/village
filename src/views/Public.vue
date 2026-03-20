<template>
  <div class="public">
    <div class="page-header">
      <div class="header-decoration">
        <div class="header-shape shape-1"></div>
        <div class="header-shape shape-2"></div>
        <div class="header-shape shape-3"></div>
      </div>
      <div class="header-content">
        <div class="header-icon">📋</div>
        <div class="header-label">阳光村务</div>
        <h1>村务公开</h1>
        <div class="header-divider"></div>
        <p class="header-subtitle">透明公开，接受监督</p>
      </div>
    </div>

    <div class="tabs">
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'all' }" 
        @click="activeTab = 'all'"
      >
        全部
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === '财务公开' }" 
        @click="activeTab = '财务公开'"
      >
        财务公开
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === '通知公告' }" 
        @click="activeTab = '通知公告'"
      >
        通知公告
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === '民政公示' }" 
        @click="activeTab = '民政公示'"
      >
        民政公示
      </div>
    </div>

    <div class="public-list">
      <div class="public-item" v-for="item in filteredPublicInfo" :key="item.id">
        <div class="item-header">
          <span class="category-tag" :class="item.category">{{ item.category }}</span>
          <span class="item-date">{{ item.date }}</span>
        </div>
        <h3 class="item-title">{{ item.title }}</h3>
        <p class="item-content">{{ item.content }}</p>
      </div>
    </div>

    <div class="empty-state" v-if="filteredPublicInfo.length === 0">
      <div class="empty-icon">📭</div>
      <p>暂无相关信息</p>
    </div>
  </div>
</template>

<script>
import { mockData } from '../data/mockData'

export default {
  name: 'Public',
  data() {
    return {
      activeTab: 'all',
      publicInfo: mockData.publicInfo,
      scrollPositions: {},
      visitedTabs: new Set()
    }
  },
  computed: {
    filteredPublicInfo() {
      if (this.activeTab === 'all') {
        return this.publicInfo
      }
      return this.publicInfo.filter(item => item.category === this.activeTab)
    }
  },
  watch: {
    activeTab(newTab, oldTab) {
      this.scrollPositions[oldTab] = window.scrollY
      
      if (this.visitedTabs.has(newTab)) {
        this.$nextTick(() => {
          window.scrollTo({
            top: this.scrollPositions[newTab] || 0,
            behavior: 'smooth'
          })
        })
      } else {
        this.$nextTick(() => {
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          })
        })
        this.visitedTabs.add(newTab)
      }
    }
  },
  beforeUnmount() {
    this.scrollPositions = {}
    this.visitedTabs.clear()
  }
}
</script>

<style scoped>
.public {
  padding-bottom: 30px;
}

.page-header {
  position: relative;
  background: linear-gradient(135deg, #002B5B 0%, #1A5F7A 50%, #57C5B6 100%);
  padding: 60px 20px 50px;
  color: white;
  text-align: center;
  overflow: hidden;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.header-shape {
  position: absolute;
  border-radius: 50%;
  background: rgba(87, 197, 182, 0.2);
  animation: drift 8s ease-in-out infinite;
}

.header-shape.shape-1 {
  width: 100px;
  height: 100px;
  top: -30px;
  right: 20%;
  animation-delay: 0s;
}

.header-shape.shape-2 {
  width: 60px;
  height: 60px;
  top: 40px;
  left: 10%;
  animation-delay: 2s;
}

.header-shape.shape-3 {
  width: 40px;
  height: 40px;
  bottom: 30px;
  right: 15%;
  animation-delay: 4s;
}

@keyframes drift {
  0%, 100% {
    transform: translate(0, 0) scale(1);
    opacity: 0.5;
  }
  25% {
    transform: translate(10px, -10px) scale(1.1);
    opacity: 0.7;
  }
  50% {
    transform: translate(0, -20px) scale(1);
    opacity: 0.6;
  }
  75% {
    transform: translate(-10px, -10px) scale(0.9);
    opacity: 0.8;
  }
}

.header-content {
  position: relative;
  z-index: 10;
}

.header-icon {
  font-size: 48px;
  margin-bottom: 12px;
  display: inline-block;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.header-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 8px;
  font-weight: 500;
}

.page-header h1 {
  font-size: 36px;
  margin: 0 0 12px;
  font-weight: 700;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  letter-spacing: 1px;
}

.header-divider {
  width: 60px;
  height: 3px;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 2px;
  margin: 0 auto 12px;
}

.header-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
}

.tabs {
  display: flex;
  background: white;
  padding: 10px 15px;
  overflow-x: auto;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab-item {
  flex-shrink: 0;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  background: #f5f5f5;
  transition: all 0.2s;
}

.tab-item.active {
  background: #4CAF50;
  color: white;
}

.public-list {
  padding: 15px;
}

.public-item {
  background: white;
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.category-tag {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.category-tag.财务公开 {
  background: #E3F2FD;
  color: #1976D2;
}

.category-tag.通知公告 {
  background: #FFF3E0;
  color: #F57C00;
}

.category-tag.民政公示 {
  background: #F3E5F5;
  color: #7B1FA2;
}

.item-date {
  font-size: 13px;
  color: #999;
}

.item-title {
  font-size: 16px;
  color: #333;
  margin: 0 0 10px;
  line-height: 1.4;
}

.item-content {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 15px;
}

.empty-state p {
  font-size: 15px;
  color: #999;
  margin: 0;
}
</style>
