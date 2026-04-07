<template>
  <div class="profile">
    <div class="hero-banner">
      <div class="banner-background">
        <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=panoramic%20view%20of%20chinese%20village%20with%20modern%20houses%20and%20green%20mountains&image_size=landscape_16_9" alt="村庄全景">
        <div class="banner-overlay"></div>
      </div>
      <div class="banner-content">
        <div class="banner-label">美丽乡村</div>
        <h1>{{ village.name }}</h1>
        <div class="banner-divider"></div>
        <p class="banner-subtitle">幸福生活从这里开始</p>
      </div>
      <div class="banner-decoration">
        <div class="decoration-circle circle-1"></div>
        <div class="decoration-circle circle-2"></div>
        <div class="decoration-circle circle-3"></div>
      </div>
    </div>

    <div class="content-section">
      <h2 class="section-title">村庄简介</h2>
      <div class="intro-card">
        <p class="intro-text">{{ overview.content }}</p>
      </div>
    </div>

    <div class="content-section">
      <h2 class="section-title">基本信息</h2>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-icon">📍</div>
          <div class="info-label">地理位置</div>
          <div class="info-value">{{ village.location }}</div>
        </div>
        <div class="info-item">
          <div class="info-icon">👥</div>
          <div class="info-label">人口数量</div>
          <div class="info-value">{{ village.population }}</div>
        </div>
        <div class="info-item">
          <div class="info-icon">🗺️</div>
          <div class="info-label">土地面积</div>
          <div class="info-value">{{ village.area }}</div>
        </div>
        <div class="info-item">
          <div class="info-icon">📅</div>
          <div class="info-label">建村时间</div>
          <div class="info-value">{{ village.established }}</div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <h2 class="section-title">荣誉称号</h2>
      <div class="honors-list">
        <div class="honor-item" v-for="(honor, index) in overview.highlights" :key="index">
          <div class="honor-badge">🏆</div>
          <span>{{ honor }}</span>
        </div>
      </div>
    </div>

    <div class="content-section">
      <h2 class="section-title">村庄风采</h2>
      <div class="gallery">
        <div class="gallery-item" v-for="photo in displayedPhotos" :key="photo.id" @click="openPreview(photo.id)">
          <img :src="photo.url" :alt="photo.alt">
          <div class="gallery-item-overlay">
            <div class="gallery-item-caption">{{ photo.caption }}</div>
          </div>
        </div>
      </div>
      <div class="load-more" v-if="displayedPhotos.length < photos.length">
        <button class="load-btn" @click="loadMore" :disabled="loading">
          <span v-if="loading">加载中...</span>
          <span v-else>加载更多</span>
        </button>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <div class="preview-modal" v-if="previewVisible" @click="closePreview">
      <div class="preview-content" @click.stop>
        <button class="preview-close" @click="closePreview">×</button>
        <div class="preview-image-container">
          <button class="preview-nav preview-nav-left" @click="prevPhoto" v-if="currentPreviewIndex > 0">←</button>
          <img :src="currentPhoto.url" :alt="currentPhoto.alt" class="preview-image" ref="previewImage">
          <button class="preview-nav preview-nav-right" @click="nextPhoto" v-if="currentPreviewIndex < displayedPhotos.length - 1">→</button>
        </div>
        <div class="preview-caption">{{ currentPhoto.caption }}</div>
        <div class="preview-info">{{ currentPreviewIndex + 1 }} / {{ displayedPhotos.length }}</div>
        <div class="preview-controls">
          <button class="preview-control-btn" @click="zoomIn">放大</button>
          <button class="preview-control-btn" @click="zoomOut">缩小</button>
          <button class="preview-control-btn" @click="resetZoom">重置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mockData } from '../data/mockData'

export default {
  name: 'Profile',
  data() {
    return {
      village: mockData.village,
      overview: mockData.overview,
      photos: mockData.photos,
      displayedPhotos: [],
      loading: false,
      loadStep: 4,
      previewVisible: false,
      currentPreviewIndex: 0,
      zoomLevel: 1
    }
  },
  mounted() {
    this.loadInitialPhotos()
  },
  computed: {
    currentPhoto() {
      return this.displayedPhotos[this.currentPreviewIndex]
    }
  },
  methods: {
    loadInitialPhotos() {
      this.displayedPhotos = this.photos.slice(0, this.loadStep)
    },
    loadMore() {
      if (this.loading) return
      
      this.loading = true
      
      // 模拟加载延迟
      setTimeout(() => {
        const nextPhotos = this.photos.slice(
          this.displayedPhotos.length,
          this.displayedPhotos.length + this.loadStep
        )
        this.displayedPhotos = [...this.displayedPhotos, ...nextPhotos]
        this.loading = false
      }, 800)
    },
    openPreview(photoId) {
      const index = this.displayedPhotos.findIndex(photo => photo.id === photoId)
      if (index !== -1) {
        this.currentPreviewIndex = index
        this.zoomLevel = 1
        this.previewVisible = true
        document.body.style.overflow = 'hidden'
      }
    },
    closePreview() {
      this.previewVisible = false
      this.zoomLevel = 1
      document.body.style.overflow = ''
    },
    prevPhoto() {
      if (this.currentPreviewIndex > 0) {
        this.currentPreviewIndex--
        this.zoomLevel = 1
      }
    },
    nextPhoto() {
      if (this.currentPreviewIndex < this.displayedPhotos.length - 1) {
        this.currentPreviewIndex++
        this.zoomLevel = 1
      }
    },
    zoomIn() {
      if (this.zoomLevel < 2) {
        this.zoomLevel += 0.2
        this.updateZoom()
      }
    },
    zoomOut() {
      if (this.zoomLevel > 0.6) {
        this.zoomLevel -= 0.2
        this.updateZoom()
      }
    },
    resetZoom() {
      this.zoomLevel = 1
      this.updateZoom()
    },
    updateZoom() {
      if (this.$refs.previewImage) {
        this.$refs.previewImage.style.transform = `scale(${this.zoomLevel})`
      }
    }
  }
}
</script>

<style scoped>
.profile {
  padding-bottom: 30px;
}

.hero-banner {
  position: relative;
  height: 320px;
  overflow: hidden;
}

.banner-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.banner-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: scale(1.05);
  transition: transform 8s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-banner:hover .banner-background img {
  transform: scale(1.12);
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.25) 0%,
    rgba(0, 0, 0, 0.15) 40%,
    rgba(0, 0, 0, 0.65) 100%
  );
}

.banner-content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 40px 24px 50px;
  text-align: center;
}

.banner-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 12px;
  font-weight: 500;
}

.banner-content h1 {
  color: white;
  font-size: 40px;
  margin: 0 0 16px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  font-weight: 700;
  letter-spacing: 2px;
}

.banner-divider {
  width: 50px;
  height: 3px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
  margin-bottom: 16px;
}

.banner-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  font-weight: 400;
}

.banner-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.15), rgba(118, 75, 162, 0.1));
  animation: float 6s ease-in-out infinite;
}

.decoration-circle.circle-1 {
  width: 120px;
  height: 120px;
  top: 30px;
  left: -30px;
  animation-delay: 0s;
}

.decoration-circle.circle-2 {
  width: 80px;
  height: 80px;
  top: 80px;
  right: -20px;
  animation-delay: 2s;
}

.decoration-circle.circle-3 {
  width: 60px;
  height: 60px;
  bottom: 100px;
  left: 40px;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.6;
  }
  50% {
    transform: translateY(-20px) scale(1.1);
    opacity: 0.8;
  }
}

.content-section {
  padding: 24px 15px;
}

.section-title {
  font-size: 20px;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 18px;
  padding-left: 14px;
  border-left: 4px solid #667eea;
  display: flex;
  align-items: center;
}

.intro-card {
  background: white;
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

.intro-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.intro-text {
  font-size: 15px;
  color: #4a5568;
  line-height: 1.9;
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.info-item {
  background: white;
  border-radius: 20px;
  padding: 24px 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.info-icon {
  font-size: 36px;
  margin-bottom: 12px;
  display: inline-block;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.info-item:hover .info-icon {
  transform: scale(1.15);
}

.info-label {
  font-size: 13px;
  color: #a0aec0;
  margin-bottom: 6px;
  font-weight: 500;
}

.info-value {
  font-size: 15px;
  color: #2d3748;
  font-weight: 600;
  line-height: 1.4;
}

.honors-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.honor-item {
  background: white;
  border-radius: 20px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.honor-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(180deg, #f093fb 0%, #f5576c 100%);
}

.honor-item:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
}

.honor-badge {
  font-size: 32px;
  margin-right: 16px;
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.honor-item:hover .honor-badge {
  transform: scale(1.2) rotate(10deg);
}

.honor-item span {
  font-size: 16px;
  color: #2d3748;
  font-weight: 600;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.gallery-item {
  border-radius: 20px;
  overflow: hidden;
  height: 160px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  cursor: pointer;
}

.gallery-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.gallery-item:hover img {
  transform: scale(1.1);
}

.gallery-item-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 16px 12px 12px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.gallery-item:hover .gallery-item-overlay {
  transform: translateY(0);
}

.gallery-item-caption {
  color: white;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
}

.load-more {
  margin-top: 24px;
  text-align: center;
}

.load-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 100px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.load-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.load-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* 预览模态框 */
.preview-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.preview-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(50px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.preview-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  z-index: 10;
  transition: all 0.3s ease;
}

.preview-close:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

.preview-image-container {
  position: relative;
  max-width: 80vw;
  max-height: 70vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  transition: transform 0.3s ease;
}

.preview-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: 24px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 5;
}

.preview-nav:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-50%) scale(1.1);
}

.preview-nav-left {
  left: 16px;
}

.preview-nav-right {
  right: 16px;
}

.preview-caption {
  padding: 20px 24px 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
  text-align: center;
}

.preview-info {
  padding: 0 24px 16px;
  font-size: 14px;
  color: #666;
  text-align: center;
}

.preview-controls {
  display: flex;
  gap: 12px;
  padding: 0 24px 20px;
}

.preview-control-btn {
  padding: 8px 16px;
  background: #f5f5f5;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
}

.preview-control-btn:hover {
  background: #e0e0e0;
  transform: translateY(-2px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .gallery {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  
  .gallery-item {
    height: 140px;
  }
  
  .preview-content {
    max-width: 95vw;
    max-height: 95vh;
  }
  
  .preview-image-container {
    max-width: 90vw;
    max-height: 60vh;
  }
  
  .preview-nav {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
  
  .preview-caption {
    font-size: 14px;
    padding: 16px 20px 8px;
  }
  
  .preview-info {
    font-size: 12px;
    padding: 0 20px 12px;
  }
  
  .preview-controls {
    padding: 0 20px 16px;
    gap: 8px;
  }
  
  .preview-control-btn {
    padding: 6px 12px;
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .gallery {
    grid-template-columns: 1fr;
  }
  
  .gallery-item {
    height: 200px;
  }
  
  .load-btn {
    padding: 10px 24px;
    font-size: 13px;
  }
}
</style>
