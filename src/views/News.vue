<template>
  <div class="news">
    <div class="page-header">
      <div class="header-decoration">
        <div class="header-shape shape-1"></div>
        <div class="header-shape shape-2"></div>
        <div class="header-shape shape-3"></div>
      </div>
      <div class="header-content">
        <div class="header-icon">📰</div>
        <div class="header-label">最新资讯</div>
        <h1>新闻动态</h1>
        <div class="header-divider"></div>
        <p class="header-subtitle">了解村里的新鲜事</p>
      </div>
    </div>

    <div class="news-list">
      <div class="news-item card card-md card-shadow-md" v-for="item in news" :key="item.id" @click="goToDetail(item.id)">
        <div class="news-image">
          <img :src="item.image" :alt="item.title">
        </div>
        <div class="news-content">
          <span class="news-date">{{ item.date }}</span>
          <h3 class="news-title">{{ item.title }}</h3>
          <p class="news-summary">{{ item.summary }}</p>
          <div class="news-more">查看详情 →</div>
        </div>
      </div>
    </div>

    <div class="load-more">
      <button class="load-btn">加载更多</button>
    </div>
  </div>
</template>

<script>
import { mockData } from '../data/mockData'

export default {
  name: 'News',
  data() {
    return {
      news: mockData.news
    }
  },
  methods: {
    goToDetail(id) {
      this.$router.push(`/news/${id}`)
    }
  }
}
</script>

<style scoped>
.news {
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

.news-list {
  padding: 15px;
}

.news-item {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  cursor: pointer;
  transition: all 0.3s;
}

.news-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
}

.news-image {
  width: 100%;
  height: 200px;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-content {
  padding: 18px;
}

.news-date {
  display: inline-block;
  font-size: 13px;
  color: #999;
  margin-bottom: 10px;
}

.news-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 12px;
  line-height: 1.4;
}

.news-summary {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px;
}

.news-more {
  font-size: 13px;
  color: #1A5F7A;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.load-more {
  padding: 20px 15px;
  text-align: center;
}

.load-btn {
  padding: 12px 40px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 25px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}

.load-btn:active {
  background: #f5f5f5;
}
</style>
