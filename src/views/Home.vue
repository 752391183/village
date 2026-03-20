<template>
  <div class="home">
    <div class="hero-section">
      <div class="hero-background">
        <img src="@/assets/home.jpg" alt="村庄风景">
        <div class="hero-overlay"></div>
      </div>
      <div class="hero-content">
        <p class="hero-subtitle">美丽乡村 · 幸福家园</p>
        <h1 class="hero-title">
          {{ typedTitle }}<span class="cursor title-cursor" :class="{ visible: showTitleCursor }">|</span>
        </h1>
        <p class="hero-slogan">
          {{ typedSlogan }}<span class="cursor slogan-cursor" :class="{ visible: showSloganCursor }">|</span>
        </p>
        <div class="hero-divider" v-if="sloganComplete"></div>
      </div>
    </div>

    <div class="feature-section">
      <div class="feature-item" v-for="(feature, index) in features" :key="index" @click="$router.push(feature.profile)">
        <div class="feature-icon">{{ feature.icon }}</div>
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.desc }}</p>
      </div>
    </div>

    <div class="section-wrapper">
      <div class="section-header">
        <div class="section-label">新闻动态</div>
        <h2 class="section-title">了解村里的新鲜事</h2>
      </div>
      <div class="news-list">
        <div class="news-item" v-for="item in news.slice(0, 3)" :key="item.id" @click="$router.push('/news')">
          <div class="news-image">
            <img :src="item.image" :alt="item.title">
          </div>
          <div class="news-content">
            <div class="news-tag">最新动态</div>
            <h3>{{ item.title }}</h3>
            <div class="news-meta">
              <span class="news-date">{{ item.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="section-wrapper products-section">
      <div class="section-header">
        <div class="section-label">特色农产品</div>
        <h2 class="section-title">绿色生态 · 品质保证</h2>
      </div>
      <ProductsComponent :showHeader="false" />
    </div>

    <div class="cta-section">
      <div class="cta-background">
        <div class="cta-content">
          <h2>探索更多精彩</h2>
          <p>走进美丽新农村，感受乡村新风貌</p>
          <div class="cta-buttons">
            <button class="cta-btn primary" @click="$router.push('/profile')">村庄概况</button>
            <button class="cta-btn secondary" @click="$router.push('/service')">便民服务</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mockData } from '../data/mockData'
import ProductsComponent from './Products.vue'

export default {
  name: 'Home',
  components: {
    ProductsComponent
  },
  data() {
    return {
      village: mockData.village,
      news: mockData.news,
      typedTitle: '',
      typedSlogan: '',
      titleComplete: false,
      sloganComplete: false,
      titleIndex: 0,
      sloganIndex: 0,
      titleTimer: null,
      sloganTimer: null,
      titleCursorTimer: null,
      sloganCursorTimer: null,
      showTitleCursor: false,
      showSloganCursor: false,
      features: [
        {
          icon: '📢',
          title: '村务公开',
          desc: '透明公开，接受监督',
          profile: '/public'
        },
        {
          icon: '👥',
          title: '关系拓扑',
          desc: '可视化人员关系网络',
          profile: '/relationship'
        },
        {
          icon: '🍽️',
          title: '酒席管理',
          desc: '便捷管理酒席信息',
          profile: '/banquet'
        },
        {
          icon: '💬',
          title: '联系我们',
          desc: '欢迎您的咨询反馈',
          profile: '/contact'
        }
      ]
    }
  },
  mounted() {
    this.startTyping()
  },
  beforeUnmount() {
    this.clearAllTimers()
  },
  methods: {
    clearAllTimers() {
      if (this.titleTimer) clearTimeout(this.titleTimer)
      if (this.sloganTimer) clearTimeout(this.sloganTimer)
      if (this.titleCursorTimer) clearInterval(this.titleCursorTimer)
      if (this.sloganCursorTimer) clearInterval(this.sloganCursorTimer)
    },
    startTyping() {
      this.typedTitle = ''
      this.typedSlogan = ''
      this.titleComplete = false
      this.sloganComplete = false
      this.titleIndex = 0
      this.sloganIndex = 0
      this.showTitleCursor = true
      this.startTitleCursorBlink()
      this.typeTitle()
    },
    startTitleCursorBlink() {
      this.titleCursorTimer = setInterval(() => {
        this.showTitleCursor = !this.showTitleCursor
      }, 530)
    },
    startSloganCursorBlink() {
      this.sloganCursorTimer = setInterval(() => {
        this.showSloganCursor = !this.showSloganCursor
      }, 530)
    },
    typeTitle() {
      const fullTitle = '车坪村'
      if (this.titleIndex < fullTitle.length) {
        this.typedTitle += fullTitle.charAt(this.titleIndex)
        this.titleIndex++
        this.titleTimer = setTimeout(() => {
          this.typeTitle()
        }, 300)
      } else {
        this.titleComplete = true
        this.showSloganCursor = true
        this.startSloganCursorBlink()
        this.typeSlogan()
      }
    },
    typeSlogan() {
      this.showTitleCursor = false
      clearInterval(this.titleCursorTimer)
      const fullSlogan = '建设美丽新农村，共创幸福新生活'
      if (this.sloganIndex < fullSlogan.length) {
        this.typedSlogan += fullSlogan.charAt(this.sloganIndex)
        this.sloganIndex++
        this.sloganTimer = setTimeout(() => {
          this.typeSlogan()
        }, 150)
      } else {
        this.sloganComplete = true
      }
    }
  }
}
</script>

<style scoped>
.home {
  background: #fafafa;
  padding-bottom: 40px;
}

.hero-section {
  position: relative;
  height: 520px;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.hero-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
  transition: transform 10s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-section:hover .hero-background img {
  transform: scale(1.12);
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3) 0%,
    rgba(0, 0, 0, 0.2) 40%,
    rgba(0, 0, 0, 0.6) 100%
  );
}

.hero-content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 40px 24px 60px;
  text-align: center;
}

.hero-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 16px;
  font-weight: 500;
}

.hero-title {
  font-size: 48px;
  color: white;
  margin: 0 0 12px;
  font-weight: 700;
  letter-spacing: 2px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  display: inline-block;
  line-height: 1.2;
}

.hero-slogan {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 28px;
  font-weight: 400;
  line-height: 1.6;
  display: inline-block;
}

.cursor {
  display: inline-block;
  font-size: 48px;
  color: white;
  margin-left: 2px;
  font-weight: 300;
  opacity: 0;
  vertical-align: middle;
}

.cursor.title-cursor {
  font-size: 48px;
}

.cursor.slogan-cursor {
  font-size: 16px;
}

.cursor.visible {
  opacity: 1;
}

.hero-divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.feature-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 24px 16px;
  margin-top: -40px;
  position: relative;
  z-index: 20;
}

.feature-item {
  background: white;
  border-radius: 20px;
  padding: 28px 20px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.feature-item:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.15);
}

.feature-icon {
  font-size: 40px;
  margin-bottom: 16px;
  display: inline-block;
}

.feature-item h3 {
  font-size: 16px;
  color: #1a1a1a;
  margin: 0 0 6px;
  font-weight: 600;
}

.feature-item p {
  font-size: 13px;
  color: #888;
  margin: 0;
  line-height: 1.5;
}

.section-wrapper {
  padding: 48px 16px;
}

.section-wrapper.products-section {
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  position: relative;
  overflow: hidden;
}

.section-wrapper.products-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 30% 30%, rgba(0, 47, 167, 0.05) 0%, transparent 60%);
  pointer-events: none;
}

.section-header {
  margin-bottom: 28px;
}

.section-label {
  font-size: 12px;
  color: #667eea;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 8px;
  font-weight: 600;
}

.section-label.light {
  color: rgba(255, 255, 255, 0.6);
}

.section-title {
  font-size: 28px;
  color: #1a1a1a;
  margin: 0;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.section-title.light {
  color: white;
}

.news-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.news-item {
  background: white;
  border-radius: 24px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.news-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.1);
}

.news-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.news-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.news-item:hover .news-image img {
  transform: scale(1.08);
}

.news-content {
  padding: 24px;
}

.news-tag {
  display: inline-block;
  font-size: 11px;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 4px 12px;
  border-radius: 100px;
  margin-bottom: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.news-content h3 {
  font-size: 18px;
  color: #1a1a1a;
  margin: 0 0 12px;
  font-weight: 600;
  line-height: 1.4;
}

.news-meta {
  display: flex;
  align-items: center;
}

.news-date {
  font-size: 13px;
  color: #aaa;
  font-weight: 500;
}



.cta-background {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 48px 28px;
  text-align: center;
  position: relative;
  overflow: hidden;
}

.cta-background::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0.8; }
}

.cta-content {
  position: relative;
  z-index: 10;
}

.cta-content h2 {
  font-size: 28px;
  color: white;
  margin: 0 0 12px;
  font-weight: 700;
}

.cta-content p {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0 0 28px;
  font-weight: 400;
}

.cta-buttons {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.cta-btn {
  padding: 14px 28px;
  border-radius: 100px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
}

.cta-btn.primary {
  background: white;
  color: #667eea;
}

.cta-btn.primary:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.cta-btn.secondary {
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.cta-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: scale(1.05);
}
</style>
