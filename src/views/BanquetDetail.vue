<template>
  <div class="banquet-detail">
    <div class="page-header">
      <div class="header-decoration">
        <div class="header-shape shape-1"></div>
        <div class="header-shape shape-2"></div>
        <div class="header-shape shape-3"></div>
      </div>
      <div class="header-content">
        <div class="header-icon">🍽️</div>
        <div class="header-label">酒席详情</div>
        <h1>{{ banquet?.title || '加载中...' }}</h1>
        <div class="header-divider"></div>
        <p class="header-subtitle">详细信息</p>
      </div>
    </div>

    <div class="detail-content" v-if="banquet">
      <div class="info-card">
        <div class="card-header">
          <div class="type-badge" :class="banquet.type">{{ banquet.type }}</div>
          <div class="status-badge" :class="banquet.status">{{ banquet.status }}</div>
        </div>
        
        <div class="info-section">
          <h2 class="info-title">{{ banquet.title }}</h2>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-icon">👤</span>
              <div class="info-text">
                <div class="info-label">主办</div>
                <div class="info-value">{{ banquet.host }}</div>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">📅</span>
              <div class="info-text">
                <div class="info-label">日期时间</div>
                <div class="info-value">{{ banquet.date }} {{ banquet.time }}</div>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">📍</span>
              <div class="info-text">
                <div class="info-label">地点</div>
                <div class="info-value">{{ banquet.location }}</div>
              </div>
            </div>
            <div class="info-item">
              <span class="info-icon">👥</span>
              <div class="info-text">
                <div class="info-label">预计人数</div>
                <div class="info-value">{{ banquet.expectedGuests }}人</div>
              </div>
            </div>
          </div>
        </div>

        <div class="description-section">
          <h3 class="section-title">详细说明</h3>
          <p class="description">{{ banquet.description }}</p>
        </div>

        <div class="invitation-section" v-if="banquet.invitationImage">
          <h3 class="section-title">请帖</h3>
          <div class="invitation-image" @click="openImagePreview(banquet.invitationImage)">
            <img :src="banquet.invitationImage" :alt="banquet.title + '请帖'" />
            <div class="image-overlay">
              <span class="zoom-icon">🔍</span>
              <span class="overlay-text">点击查看大图</span>
            </div>
          </div>
        </div>

        <div class="menu-section">
          <h3 class="section-title">🍽️ 菜单</h3>
          <div class="menu-tags">
            <span v-for="(dish, idx) in banquet.menu" :key="idx" class="menu-tag">{{ dish }}</span>
          </div>
        </div>
      </div>

      <div class="action-section">
        <button class="back-btn" @click="goBack">
          <span class="back-icon">←</span> 返回列表
        </button>
      </div>
    </div>

    <div class="loading-state" v-else>
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <!-- 图片预览模态框 -->
    <div class="modal-overlay" v-if="imagePreviewUrl" @click="closeImagePreview">
      <div class="image-preview-modal" @click.stop>
        <button class="close-btn" @click="closeImagePreview">×</button>
        <div class="preview-container" ref="previewContainer" @wheel="handleZoom">
          <img 
            :src="imagePreviewUrl" 
            :alt="'预览图片'" 
            class="preview-image" 
            :style="{ transform: `scale(${zoomLevel})` }"
            @mousedown="startDrag"
            @mousemove="handleDrag"
            @mouseup="stopDrag"
            @mouseleave="stopDrag"
          />
        </div>
        <div class="zoom-controls">
          <button class="zoom-btn" @click="zoomIn">+</button>
          <button class="zoom-btn" @click="zoomOut">-</button>
          <button class="zoom-btn" @click="resetZoom">重置</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mockData } from '../data/mockData'

export default {
  name: 'BanquetDetail',
  data() {
    return {
      banquet: null,
      imagePreviewUrl: null,
      zoomLevel: 1,
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0
    }
  },
  mounted() {
    this.loadBanquetData()
  },
  methods: {
    loadBanquetData() {
      const id = this.$route.params.id
      this.banquet = mockData.banquets.find(b => b.id == id)
    },
    goBack() {
      this.$router.push('/banquet')
    },
    openImagePreview(url) {
      this.imagePreviewUrl = url
      this.zoomLevel = 1
      this.currentX = 0
      this.currentY = 0
    },
    closeImagePreview() {
      this.imagePreviewUrl = null
      this.zoomLevel = 1
      this.isDragging = false
    },
    zoomIn() {
      if (this.zoomLevel < 3) {
        this.zoomLevel += 0.2
      }
    },
    zoomOut() {
      if (this.zoomLevel > 0.5) {
        this.zoomLevel -= 0.2
      }
    },
    resetZoom() {
      this.zoomLevel = 1
      this.currentX = 0
      this.currentY = 0
    },
    handleZoom(e) {
      e.preventDefault()
      const delta = e.deltaY > 0 ? -0.1 : 0.1
      if ((this.zoomLevel > 0.5 || delta > 0) && (this.zoomLevel < 3 || delta < 0)) {
        this.zoomLevel += delta
      }
    },
    startDrag(e) {
      this.isDragging = true
      this.startX = e.clientX - this.currentX
      this.startY = e.clientY - this.currentY
    },
    handleDrag(e) {
      if (this.isDragging) {
        this.currentX = e.clientX - this.startX
        this.currentY = e.clientY - this.startY
      }
    },
    stopDrag() {
      this.isDragging = false
    }
  }
}
</script>

<style scoped>
.banquet-detail {
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

.detail-content {
  padding: 20px 15px;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.type-badge {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.type-badge.婚宴 {
  background: linear-gradient(135deg, #ff9a9e, #fecfef);
  color: #c2185b;
}

.type-badge.寿宴 {
  background: linear-gradient(135deg, #ffecd2, #fcb69f);
  color: #e65100;
}

.type-badge.满月酒 {
  background: linear-gradient(135deg, #a8edea, #fed6e3);
  color: #00796b;
}

.type-badge.其他 {
  background: linear-gradient(135deg, #d299c2, #fef9d7);
  color: #6a1b9a;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  background: #e8f5e9;
  color: #2e7d32;
}

.info-section {
  margin-bottom: 24px;
}

.info-title {
  font-size: 22px;
  color: #2d3748;
  margin: 0 0 20px;
  font-weight: 600;
}

.info-grid {
  display: grid;
  gap: 16px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f7fafc;
  border-radius: 12px;
}

.info-icon {
  font-size: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.info-text {
  flex: 1;
}

.info-label {
  font-size: 13px;
  color: #718096;
  margin-bottom: 4px;
}

.info-value {
  font-size: 15px;
  color: #2d3748;
  font-weight: 500;
}

.description-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 18px;
  color: #2d3748;
  margin: 0 0 12px;
  font-weight: 600;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

.description {
  font-size: 15px;
  color: #4a5568;
  line-height: 1.6;
  margin: 0;
}

.invitation-section {
  margin-bottom: 24px;
}

.invitation-image {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
}

.invitation-image:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.invitation-image img {
  width: 100%;
  height: auto;
  display: block;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.invitation-image:hover .image-overlay {
  opacity: 1;
}

.zoom-icon {
  font-size: 32px;
  color: white;
  margin-bottom: 8px;
}

.overlay-text {
  color: white;
  font-size: 14px;
  font-weight: 500;
}

.menu-section {
  margin-bottom: 20px;
}

.menu-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
  background: #f7fafc;
  border-radius: 12px;
}

.menu-tag {
  padding: 6px 16px;
  background: white;
  border-radius: 16px;
  font-size: 14px;
  color: #4a5568;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.action-section {
  text-align: center;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
}

.back-icon {
  font-size: 18px;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #002fa7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  font-size: 15px;
  color: #666;
  margin: 0;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.image-preview-modal {
  position: relative;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  font-size: 24px;
  color: white;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.8);
}

.preview-container {
  position: relative;
  width: 100%;
  height: 60vh;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
}

.preview-container:active {
  cursor: grabbing;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.1s ease;
  transform-origin: center;
}

.zoom-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  background: rgba(0, 0, 0, 0.6);
  padding: 10px 20px;
  border-radius: 25px;
}

.zoom-btn {
  width: 40px;
  height: 40px;
  border: none;
  background: white;
  border-radius: 50%;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.zoom-btn:hover {
  background: #f7fafc;
  transform: scale(1.1);
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr 1fr;
  }
  
  .invitation-image {
    max-width: 500px;
    margin: 0 auto;
  }
}
</style>