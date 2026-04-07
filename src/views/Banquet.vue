<template>
  <div class="banquet">
    <div class="page-header">
      <div class="header-decoration">
        <div class="header-shape shape-1"></div>
        <div class="header-shape shape-2"></div>
        <div class="header-shape shape-3"></div>
      </div>
      <div class="header-content">
        <div class="header-icon">🍽️</div>
        <div class="header-label">酒席管理</div>
        <h1>酒席管理</h1>
        <div class="header-divider"></div>
        <p class="header-subtitle">发布和管理村里的酒席信息</p>
        <button class="add-btn" @click="showAddForm = true">
          <span class="add-icon">+</span> 发布酒席
        </button>
      </div>
    </div>

    <div class="tabs">
      <div 
        class="tab-item" 
        :class="{ active: activeTab === 'all' }" 
        @click="switchTab('all')"
      >
        全部
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === '婚宴' }" 
        @click="switchTab('婚宴')"
      >
        婚宴
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === '寿宴' }" 
        @click="switchTab('寿宴')"
      >
        寿宴
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === '满月酒' }" 
        @click="switchTab('满月酒')"
      >
        满月酒
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === '追悼会' }" 
        @click="switchTab('追悼会')"
      >
        追悼会
      </div>
    </div>

    <!-- 动画效果容器 -->
    <div class="animation-container" v-if="showAnimation">
      <!-- 全部动画 -->
      <div v-if="animationType === 'all'" class="all-animation">
        <div class="confetti"></div>
        <div class="stars"></div>
        <div class="animation-text">
          <h2>酒席管理</h2>
          <p>欢迎查看所有酒席信息</p>
        </div>
      </div>
      <!-- 婚宴动画 -->
      <div v-else-if="animationType === 'wedding'" class="wedding-animation">
        <div class="fireworks"></div>
        <div class="hearts"></div>
        <div class="ribbons"></div>
        <div class="animation-text">
          <h2>喜结良缘</h2>
          <p>百年好合，永结同心</p>
        </div>
      </div>
      <!-- 寿宴动画 -->
      <div v-else-if="animationType === 'birthday'" class="birthday-animation">
        <div class="balloons"></div>
        <div class="gifts"></div>
        <div class="animation-text">
          <h2>寿比南山</h2>
          <p>福如东海，寿比南山</p>
        </div>
      </div>
      <!-- 满月酒动画 -->
      <div v-else-if="animationType === 'baby'" class="baby-animation">
        <div class="pacifiers"></div>
        <div class="toys"></div>
        <div class="animation-text">
          <h2>喜得贵子</h2>
          <p>健康成长，快乐无忧</p>
        </div>
      </div>
      <!-- 追悼会动画 -->
      <div v-else-if="animationType === 'memorial'" class="memorial-animation">
        <div class="candles"></div>
        <div class="doves"></div>
        <div class="flowers"></div>
        <div class="animation-text">
          <h2>逝者安息</h2>
          <p>愿逝者安息，生者坚强</p>
        </div>
      </div>
    </div>

    <div class="banquet-list">
      <div class="banquet-card card card-md card-shadow-md" v-for="banquet in filteredBanquets" :key="banquet.id">
        <div class="card-header">
          <div class="type-badge" :class="banquet.type">{{ banquet.type }}</div>
          <div class="status-badge" :class="banquet.status">{{ banquet.status }}</div>
        </div>
        <h3 class="banquet-title">{{ banquet.title }}</h3>
        <div class="banquet-info">
          <div class="info-item">
            <span class="info-icon">👤</span>
            <span>主办：{{ banquet.host }}</span>
          </div>
          <div class="info-item">
            <span class="info-icon">📅</span>
            <span>{{ banquet.date }} {{ banquet.time }}</span>
          </div>
          <div class="info-item">
            <span class="info-icon">📍</span>
            <span>{{ banquet.location }}</span>
          </div>
          <div class="info-item">
            <span class="info-icon">👥</span>
            <span>预计{{ banquet.expectedGuests }}人</span>
          </div>
        </div>
        <p class="banquet-desc">{{ getSummary(banquet.description) }}</p>
        
        <!-- 请帖照片展示区域 -->
        <div class="invitation-section">
          <!-- 普通酒席请帖 -->
          <div v-if="banquet.invitationImage && banquet.type !== '追悼会'">
            <div class="invitation-title">📨 请帖：</div>
            <div class="invitation-image" @click="openImagePreview(banquet.invitationImage)">
              <div class="image-container">
                <img 
                  :src="banquet.invitationImage" 
                  :alt="banquet.title + '请帖'" 
                  class="lazy-image"
                  loading="lazy"
                  @load="handleImageLoad"
                  @error="handleImageError"
                />
                <div class="image-loading" v-if="imageLoading[banquet.id]">
                  <div class="loading-spinner"></div>
                </div>
                <div class="image-error" v-if="imageError[banquet.id]">
                  <span class="error-icon">📄</span>
                  <span class="error-text">图片加载失败</span>
                </div>
              </div>
              <div class="image-overlay">
                <span class="zoom-icon">🔍</span>
                <span class="overlay-text">点击查看大图</span>
              </div>
            </div>
          </div>
          
          <!-- 追悼会特殊展示 -->
          <div v-else-if="banquet.type === '追悼会'" class="memorial-section">
            <div class="memorial-title">🕯️ 逝者缅怀：</div>
            <div class="memorial-content">
              <div class="memorial-image">
                <div class="memorial-icon">🕊️</div>
                <div class="memorial-text">
                  <h4>逝者节哀</h4>
                  <p>愿逝者安息，生者坚强</p>
                  <p class="memorial-subtext">缅怀先人，寄托哀思</p>
                </div>
              </div>
              <div class="memorial-description">
                <p>{{ banquet.description }}</p>
              </div>
            </div>
          </div>
          
          <!-- 无请帖其他情况 -->
          <div v-else class="no-invitation-section">
            <div class="no-invitation-title">📨 请帖：</div>
            <div class="no-invitation-content">
              <span class="no-invitation-icon">📄</span>
              <span class="no-invitation-text">暂无请帖信息</span>
            </div>
          </div>
        </div>
        
        <div class="menu-section">
          <div class="menu-title">🍽️ 菜单预览：</div>
          <div class="menu-tags">
            <span v-for="(dish, idx) in banquet.menu.slice(0, 3)" :key="idx" class="menu-tag">{{ dish }}</span>
            <span v-if="banquet.menu.length > 3" class="menu-tag">等{{ banquet.menu.length }}道菜</span>
          </div>
        </div>
        <div class="card-actions">
          <button class="action-btn edit-btn" @click="editBanquet(banquet)">编辑</button>
          <button class="action-btn delete-btn" @click="deleteBanquet(banquet.id)">删除</button>
        </div>
      </div>
    </div>

    <div class="empty-state" v-if="filteredBanquets.length === 0">
      <div class="empty-icon">🎉</div>
      <p>暂无酒席信息</p>
      <button class="empty-add-btn" @click="showAddForm = true">发布第一个酒席</button>
    </div>

    <div class="modal-overlay" v-if="showAddForm || editingBanquet" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ editingBanquet ? '编辑酒席' : '发布酒席' }}</h2>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <form @submit.prevent="submitBanquet" class="modal-body">
          <div class="form-group">
            <label>酒席标题 *</label>
            <input v-model="formData.title" type="text" placeholder="例如：李家儿子婚宴" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>主办人 *</label>
              <input v-model="formData.host" type="text" placeholder="请输入主办人姓名" required>
            </div>
            <div class="form-group">
              <label>酒席类型 *</label>
              <select v-model="formData.type" required>
                <option value="">请选择</option>
                <option value="婚宴">婚宴</option>
                <option value="寿宴">寿宴</option>
                <option value="满月酒">满月酒</option>
                <option value="追悼会">追悼会</option>
                <option value="其他">其他</option>
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>日期 *</label>
              <input v-model="formData.date" type="date" required>
            </div>
            <div class="form-group">
              <label>时间 *</label>
              <input v-model="formData.time" type="time" required>
            </div>
          </div>
          <div class="form-group">
            <label>地点 *</label>
            <input v-model="formData.location" type="text" placeholder="请输入酒席地点" required>
          </div>
          <div class="form-group">
            <label>预计人数</label>
            <input v-model.number="formData.expectedGuests" type="number" placeholder="请输入预计人数" min="1">
          </div>
          <div class="form-group">
            <label>详细说明</label>
            <textarea v-model="formData.description" rows="3" placeholder="请输入酒席详细说明"></textarea>
          </div>
          <div class="form-group">
            <label>菜单（用逗号分隔）</label>
            <input v-model="menuInput" type="text" placeholder="例如：红烧肉,清蒸鱼,宫保鸡丁">
          </div>
          <div class="modal-actions">
            <button type="button" class="cancel-btn" @click="closeModal">取消</button>
            <button type="submit" class="submit-btn">{{ editingBanquet ? '保存修改' : '发布' }}</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 图片预览模态框 -->
    <div class="modal-overlay" v-if="imagePreviewUrl" @click="closeImagePreview">
      <div class="image-preview-modal" @click.stop>
        <button class="close-btn" @click="closeImagePreview">×</button>
        <div class="preview-container" ref="previewContainer" @wheel="handleZoom">
          <div class="preview-content">
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
  name: 'Banquet',
  data() {
    return {
      banquets: [...mockData.banquets],
      activeTab: 'all',
      showAddForm: false,
      editingBanquet: null,
      formData: {
        id: null,
        title: '',
        host: '',
        date: '',
        time: '',
        location: '',
        type: '',
        expectedGuests: '',
        status: '筹备中',
        description: '',
        menu: []
      },
      menuInput: '',
      // 图片预览相关数据
      imagePreviewUrl: null,
      zoomLevel: 1,
      isDragging: false,
      startX: 0,
      startY: 0,
      currentX: 0,
      currentY: 0,
      // 图片加载状态
      imageLoading: {},
      imageError: {},
      // 动画相关数据
      showAnimation: false,
      animationType: ''
    }
  },
  computed: {
    filteredBanquets() {
      if (this.activeTab === 'all') {
        return this.banquets
      }
      return this.banquets.filter(b => b.type === this.activeTab)
    }
  },
  methods: {
    getSummary(description) {
      if (!description) return ''
      const text = description.replace(/\n/g, ' ')
      return text.length > 60 ? text.substring(0, 60) + '...' : text
    },
    editBanquet(banquet) {
      this.editingBanquet = { ...banquet }
      this.formData = { ...banquet }
      this.menuInput = banquet.menu.join(',')
    },
    deleteBanquet(id) {
      if (confirm('确定要删除这个酒席信息吗？')) {
        this.banquets = this.banquets.filter(b => b.id !== id)
      }
    },
    submitBanquet() {
      const menu = this.menuInput.split(',').map(m => m.trim()).filter(m => m)
      this.formData.menu = menu.length > 0 ? menu : ['菜品待定']
      
      if (this.editingBanquet) {
        const index = this.banquets.findIndex(b => b.id === this.editingBanquet.id)
        if (index !== -1) {
          this.banquets[index] = { ...this.formData }
        }
      } else {
        this.formData.id = Date.now()
        this.banquets.unshift({ ...this.formData })
      }
      
      this.closeModal()
    },
    closeModal() {
      this.showAddForm = false
      this.editingBanquet = null
      this.formData = {
        id: null,
        title: '',
        host: '',
        date: '',
        time: '',
        location: '',
        type: '',
        expectedGuests: '',
        status: '筹备中',
        description: '',
        menu: []
      }
      this.menuInput = ''
    },
    // 图片加载相关方法
    handleImageLoad(event) {
      const id = event.target.dataset.id
      if (id) {
        this.$set(this.imageLoading, id, false)
        this.$set(this.imageError, id, false)
      }
    },
    handleImageError(event) {
      const id = event.target.dataset.id
      if (id) {
        this.$set(this.imageLoading, id, false)
        this.$set(this.imageError, id, true)
      }
    },
    // 切换标签方法
    switchTab(tab) {
      this.activeTab = tab
      
      // 触发动画效果
      if (tab === '婚宴') {
        this.showWeddingAnimation()
      } else if (tab === '寿宴') {
        this.showBirthdayAnimation()
      } else if (tab === '满月酒') {
        this.showBabyAnimation()
      } else if (tab === '追悼会') {
        this.showMemorialAnimation()
      } else if (tab === 'all') {
        this.showAllAnimation()
      }
    },
    // 全部动画
    showAllAnimation() {
      this.animationType = 'all'
      this.showAnimation = true
      
      setTimeout(() => {
        this.showAnimation = false
      }, 3000)
    },
    // 婚宴动画
    showWeddingAnimation() {
      this.animationType = 'wedding'
      this.showAnimation = true
      
      setTimeout(() => {
        this.showAnimation = false
      }, 3000)
    },
    // 寿宴动画
    showBirthdayAnimation() {
      this.animationType = 'birthday'
      this.showAnimation = true
      
      setTimeout(() => {
        this.showAnimation = false
      }, 3000)
    },
    // 满月酒动画
    showBabyAnimation() {
      this.animationType = 'baby'
      this.showAnimation = true
      
      setTimeout(() => {
        this.showAnimation = false
      }, 3000)
    },
    // 追悼会动画
    showMemorialAnimation() {
      this.animationType = 'memorial'
      this.showAnimation = true
      
      setTimeout(() => {
        this.showAnimation = false
      }, 3000)
    },
    // 图片预览相关方法
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
.banquet {
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
  margin: 0 0 15px;
  font-weight: 400;
}

.add-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 32px;
  border-radius: 25px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
  border: none;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.add-btn:active {
  transform: translateY(0);
}

.add-icon {
  font-size: 18px;
  margin-right: 5px;
}

.tabs {
  display: flex;
  background: white;
  padding: 10px 15px;
  overflow-x: auto;
  gap: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
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
  transition: all 0.3s;
}

.tab-item.active {
  background: white;
  color: #2d3748;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

/* 动画效果样式 */
.animation-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  pointer-events: none;
  animation: fadeIn 0.3s ease;
}

.all-animation,
.wedding-animation,
.birthday-animation,
.baby-animation,
.memorial-animation {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
  opacity: 0.9;
}

.all-animation {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.8), rgba(118, 75, 162, 0.8));
  color: white;
}

.wedding-animation {
  background: linear-gradient(135deg, rgba(255, 154, 158, 0.8), rgba(254, 207, 239, 0.8));
  color: #c2185b;
}

.birthday-animation {
  background: linear-gradient(135deg, rgba(255, 236, 210, 0.8), rgba(252, 182, 159, 0.8));
  color: #e65100;
}

.baby-animation {
  background: linear-gradient(135deg, rgba(168, 237, 234, 0.8), rgba(254, 214, 227, 0.8));
  color: #00796b;
}

.memorial-animation {
  background: linear-gradient(135deg, rgba(113, 128, 150, 0.8), rgba(160, 174, 192, 0.8));
  color: white;
}

.animation-text {
  text-align: center;
  padding: 20px;
  max-width: 80%;
  animation: zoomIn 0.5s ease;
}

.animation-text h2 {
  font-size: 56px;
  margin: 0 0 20px;
  font-weight: 800;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: float 3s ease-in-out infinite;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  letter-spacing: 2px;
}

.animation-text p {
  font-size: 28px;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  animation: float 3s ease-in-out infinite 0.5s;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  letter-spacing: 1px;
}

/* 全部动画效果 */
.all-animation .confetti {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.all-animation .confetti::before,
.all-animation .confetti::after,
.all-animation .confetti span,
.all-animation .confetti i,
.all-animation .confetti b {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  animation: confetti 3s ease-in-out infinite;
}

.all-animation .confetti::before {
  background: #ff6b6b;
  top: 10%;
  left: 20%;
  animation-delay: 0s;
}

.all-animation .confetti::after {
  background: #4ecdc4;
  top: 15%;
  right: 20%;
  animation-delay: 0.5s;
}

.all-animation .confetti span {
  background: #ffd93d;
  top: 20%;
  left: 60%;
  animation-delay: 1s;
}

.all-animation .confetti i {
  background: #6a0dad;
  top: 30%;
  right: 40%;
  animation-delay: 1.5s;
}

.all-animation .confetti b {
  background: #ff9a9e;
  top: 40%;
  left: 30%;
  animation-delay: 2s;
}

.all-animation .stars {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.all-animation .stars::before,
.all-animation .stars::after,
.all-animation .stars span,
.all-animation .stars i,
.all-animation .stars b {
  content: '⭐';
  position: absolute;
  font-size: 24px;
  animation: twinkle 2s ease-in-out infinite;
}

.all-animation .stars::before {
  top: 20%;
  left: 30%;
  animation-delay: 0s;
}

.all-animation .stars::after {
  top: 25%;
  right: 30%;
  animation-delay: 0.5s;
}

.all-animation .stars span {
  top: 35%;
  left: 70%;
  animation-delay: 1s;
}

.all-animation .stars i {
  top: 45%;
  right: 50%;
  animation-delay: 1.5s;
}

.all-animation .stars b {
  top: 55%;
  left: 20%;
  animation-delay: 2s;
}

/* 婚宴动画效果 */
.wedding-animation .fireworks {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.wedding-animation .fireworks::before,
.wedding-animation .fireworks::after,
.wedding-animation .fireworks span,
.wedding-animation .fireworks i,
.wedding-animation .fireworks b {
  content: '';
  position: absolute;
  width: 15px;
  height: 15px;
  background: #ff6b6b;
  border-radius: 50%;
  animation: firework 2s ease-in-out infinite;
}

.wedding-animation .fireworks::before {
  top: 10%;
  left: 20%;
  animation-delay: 0s;
}

.wedding-animation .fireworks::after {
  top: 15%;
  right: 20%;
  background: #4ecdc4;
  animation-delay: 0.5s;
}

.wedding-animation .fireworks span {
  top: 20%;
  left: 50%;
  background: #ffd93d;
  animation-delay: 1s;
}

.wedding-animation .fireworks i {
  top: 25%;
  right: 60%;
  background: #ff9a9e;
  animation-delay: 1.5s;
}

.wedding-animation .fireworks b {
  top: 30%;
  left: 70%;
  background: #fecfef;
  animation-delay: 2s;
}

.wedding-animation .hearts {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.wedding-animation .hearts::before,
.wedding-animation .hearts::after,
.wedding-animation .hearts span,
.wedding-animation .hearts i,
.wedding-animation .hearts b {
  content: '❤️';
  position: absolute;
  font-size: 28px;
  animation: heart 3s ease-in-out infinite;
}

.wedding-animation .hearts::before {
  top: 30%;
  left: 15%;
  animation-delay: 0s;
}

.wedding-animation .hearts::after {
  top: 40%;
  right: 15%;
  font-size: 24px;
  animation-delay: 0.5s;
}

.wedding-animation .hearts span {
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 20px;
  animation-delay: 1s;
}

.wedding-animation .hearts i {
  top: 60%;
  right: 60%;
  font-size: 16px;
  animation-delay: 1.5s;
}

.wedding-animation .hearts b {
  top: 70%;
  left: 30%;
  font-size: 12px;
  animation-delay: 2s;
}

.wedding-animation .ribbons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.wedding-animation .ribbons::before,
.wedding-animation .ribbons::after,
.wedding-animation .ribbons span {
  content: '🎀';
  position: absolute;
  font-size: 32px;
  animation: ribbon 4s ease-in-out infinite;
}

.wedding-animation .ribbons::before {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.wedding-animation .ribbons::after {
  top: 25%;
  right: 10%;
  animation-delay: 1s;
}

.wedding-animation .ribbons span {
  top: 35%;
  left: 70%;
  animation-delay: 2s;
}

/* 寿宴动画效果 */
.birthday-animation .balloons {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.birthday-animation .balloons::before,
.birthday-animation .balloons::after,
.birthday-animation .balloons span,
.birthday-animation .balloons i,
.birthday-animation .balloons b {
  content: '🎈';
  position: absolute;
  font-size: 36px;
  animation: balloon 4s ease-in-out infinite;
}

.birthday-animation .balloons::before {
  top: 10%;
  left: 15%;
  animation-delay: 0s;
}

.birthday-animation .balloons::after {
  top: 15%;
  right: 15%;
  font-size: 32px;
  animation-delay: 0.5s;
}

.birthday-animation .balloons span {
  top: 20%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 28px;
  animation-delay: 1s;
}

.birthday-animation .balloons i {
  top: 25%;
  right: 60%;
  font-size: 24px;
  animation-delay: 1.5s;
}

.birthday-animation .balloons b {
  top: 30%;
  left: 70%;
  font-size: 20px;
  animation-delay: 2s;
}

.birthday-animation .gifts {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.birthday-animation .gifts::before,
.birthday-animation .gifts::after,
.birthday-animation .gifts span,
.birthday-animation .gifts i {
  content: '🎁';
  position: absolute;
  font-size: 32px;
  animation: gift 3s ease-in-out infinite;
}

.birthday-animation .gifts::before {
  bottom: 10%;
  left: 20%;
  animation-delay: 0s;
}

.birthday-animation .gifts::after {
  bottom: 15%;
  right: 20%;
  animation-delay: 0.5s;
}

.birthday-animation .gifts span {
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1s;
}

.birthday-animation .gifts i {
  bottom: 25%;
  right: 60%;
  animation-delay: 1.5s;
}

/* 满月酒动画效果 */
.baby-animation .pacifiers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.baby-animation .pacifiers::before,
.baby-animation .pacifiers::after,
.baby-animation .pacifiers span,
.baby-animation .pacifiers i {
  content: '🍼';
  position: absolute;
  font-size: 36px;
  animation: pacifier 3s ease-in-out infinite;
}

.baby-animation .pacifiers::before {
  top: 20%;
  left: 15%;
  animation-delay: 0s;
}

.baby-animation .pacifiers::after {
  top: 25%;
  right: 15%;
  animation-delay: 0.5s;
}

.baby-animation .pacifiers span {
  top: 35%;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1s;
}

.baby-animation .pacifiers i {
  top: 45%;
  right: 60%;
  animation-delay: 1.5s;
}

.baby-animation .toys {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.baby-animation .toys::before,
.baby-animation .toys::after,
.baby-animation .toys span,
.baby-animation .toys i,
.baby-animation .toys b {
  position: absolute;
  font-size: 32px;
  animation: toy 4s ease-in-out infinite;
}

.baby-animation .toys::before {
  content: '🎮';
  bottom: 10%;
  left: 20%;
  animation-delay: 0s;
}

.baby-animation .toys::after {
  content: '🧸';
  bottom: 15%;
  right: 20%;
  animation-delay: 0.5s;
}

.baby-animation .toys span {
  content: '🎯';
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1s;
}

.baby-animation .toys i {
  content: '🎨';
  bottom: 25%;
  right: 60%;
  animation-delay: 1.5s;
}

.baby-animation .toys b {
  content: '🎪';
  bottom: 30%;
  left: 70%;
  animation-delay: 2s;
}

/* 追悼会动画效果 */
.memorial-animation .candles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.memorial-animation .candles::before,
.memorial-animation .candles::after,
.memorial-animation .candles span {
  content: '🕯️';
  position: absolute;
  font-size: 40px;
  animation: candle 3s ease-in-out infinite;
}

.memorial-animation .candles::before {
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 0s;
}

.memorial-animation .candles::after {
  top: 25%;
  left: 30%;
  font-size: 32px;
  animation-delay: 1s;
}

.memorial-animation .candles span {
  top: 35%;
  right: 30%;
  font-size: 24px;
  animation-delay: 2s;
}

.memorial-animation .doves {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.memorial-animation .doves::before,
.memorial-animation .doves::after,
.memorial-animation .doves span,
.memorial-animation .doves i,
.memorial-animation .doves b {
  content: '🕊️';
  position: absolute;
  font-size: 32px;
  animation: dove 4s ease-in-out infinite;
}

.memorial-animation .doves::before {
  top: 20%;
  left: 20%;
  animation-delay: 0s;
}

.memorial-animation .doves::after {
  top: 25%;
  right: 20%;
  font-size: 28px;
  animation-delay: 0.5s;
}

.memorial-animation .doves span {
  top: 30%;
  left: 60%;
  font-size: 24px;
  animation-delay: 1s;
}

.memorial-animation .doves i {
  top: 35%;
  right: 60%;
  font-size: 20px;
  animation-delay: 1.5s;
}

.memorial-animation .doves b {
  top: 40%;
  left: 80%;
  font-size: 16px;
  animation-delay: 2s;
}

.memorial-animation .flowers {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.memorial-animation .flowers::before,
.memorial-animation .flowers::after,
.memorial-animation .flowers span,
.memorial-animation .flowers i {
  content: '🌸';
  position: absolute;
  font-size: 28px;
  animation: flower 3s ease-in-out infinite;
}

.memorial-animation .flowers::before {
  bottom: 15%;
  left: 25%;
  animation-delay: 0s;
}

.memorial-animation .flowers::after {
  bottom: 20%;
  right: 25%;
  animation-delay: 0.5s;
}

.memorial-animation .flowers span {
  bottom: 25%;
  left: 50%;
  transform: translateX(-50%);
  animation-delay: 1s;
}

.memorial-animation .flowers i {
  bottom: 30%;
  right: 60%;
  animation-delay: 1.5s;
}

/* 动画关键帧 */
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes confetti {
  0% {
    transform: scale(0) translateY(0) rotate(0deg);
    opacity: 1;
  }
  100% {
    transform: scale(2) translateY(200px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes twinkle {
  0%, 100% {
    transform: scale(1);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.3);
    opacity: 1;
  }
}

@keyframes firework {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  50% {
    transform: scale(2);
    opacity: 0.8;
  }
  100% {
    transform: scale(4);
    opacity: 0;
  }
}

@keyframes heart {
  0% {
    transform: scale(0) translateY(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.3) translateY(-30px);
    opacity: 0.8;
  }
  100% {
    transform: scale(0) translateY(-60px);
    opacity: 0;
  }
}

@keyframes ribbon {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}

@keyframes balloon {
  0% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) translateY(-50px);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) translateY(-100px);
    opacity: 0;
  }
}

@keyframes gift {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.1) rotate(10deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes pacifier {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(180deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(360deg);
    opacity: 1;
  }
}

@keyframes toy {
  0% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) translateY(-30px);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) translateY(0);
    opacity: 1;
  }
}

@keyframes candle {
  0% {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
  50% {
    transform: translateX(-50%) scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: translateX(-50%) scale(1);
    opacity: 1;
  }
}

@keyframes dove {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 1;
  }
  50% {
    transform: translateX(150px) translateY(-75px);
    opacity: 0.8;
  }
  100% {
    transform: translateX(300px) translateY(-150px);
    opacity: 0;
  }
}

@keyframes flower {
  0% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
  50% {
    transform: scale(1.2) rotate(10deg);
    opacity: 0.8;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes zoomIn {
  from { 
    transform: scale(0.8); 
    opacity: 0;
  }
  to { 
    transform: scale(1); 
    opacity: 1;
  }
}

.banquet-list {
  padding: 15px;
}

.banquet-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
}

.banquet-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
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

.type-badge.追悼会 {
  background: linear-gradient(135deg, #718096, #a0aec0);
  color: #2d3748;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  background: #e8f5e9;
  color: #2e7d32;
}

.banquet-title {
  font-size: 18px;
  color: #2d3748;
  margin: 0 0 15px;
  font-weight: 600;
}

.banquet-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 15px;
}

.info-item {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #4a5568;
}

.info-icon {
  font-size: 16px;
  margin-right: 8px;
}

.banquet-desc {
  font-size: 14px;
  color: #718096;
  line-height: 1.6;
  margin: 0 0 15px;
}

/* 请帖照片展示区域 */
.invitation-section {
  margin-bottom: 15px;
}

/* 普通酒席请帖 */
.invitation-title {
  font-size: 13px;
  color: #4a5568;
  margin-bottom: 8px;
}

.invitation-image {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s;
  max-width: 100%;
  margin: 0 auto;
}

.invitation-image:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #f7fafc;
  border-radius: 12px;
  overflow: hidden;
}

.lazy-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s;
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
}

.image-loading .loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e2e8f0;
  border-top-color: #002fa7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.image-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
  color: #e53e3e;
}

.error-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.error-text {
  font-size: 14px;
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

/* 追悼会特殊展示 */
.memorial-section {
  margin-top: 10px;
}

.memorial-title {
  font-size: 13px;
  color: #4a5568;
  margin-bottom: 8px;
}

.memorial-content {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #718096;
}

.memorial-image {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.memorial-icon {
  font-size: 48px;
  flex-shrink: 0;
}

.memorial-text {
  flex: 1;
}

.memorial-text h4 {
  font-size: 18px;
  color: #2d3748;
  margin: 0 0 8px;
  font-weight: 600;
}

.memorial-text p {
  font-size: 14px;
  color: #4a5568;
  margin: 0 0 4px;
  line-height: 1.4;
}

.memorial-text .memorial-subtext {
  font-size: 13px;
  color: #718096;
  font-style: italic;
}

.memorial-description {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.6;
}

.memorial-description p {
  margin: 0;
}

/* 无请帖情况 */
.no-invitation-section {
  margin-top: 10px;
}

.no-invitation-title {
  font-size: 13px;
  color: #4a5568;
  margin-bottom: 8px;
}

.no-invitation-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  background: #f7fafc;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  border: 2px dashed #e2e8f0;
}

.no-invitation-icon {
  font-size: 32px;
  color: #a0aec0;
}

.no-invitation-text {
  font-size: 14px;
  color: #718096;
  font-weight: 500;
}

.menu-section {
  margin-bottom: 15px;
}

.menu-title {
  font-size: 13px;
  color: #4a5568;
  margin-bottom: 8px;
}

.menu-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.menu-tag {
  padding: 4px 12px;
  background: #f7fafc;
  border-radius: 12px;
  font-size: 12px;
  color: #4a5568;
}

.card-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.edit-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.delete-btn {
  background: #fee2e2;
  color: #dc2626;
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
  margin: 0 0 20px;
}

.empty-add-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: white;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 20px 20px 0 0;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h2 {
  font-size: 18px;
  color: #2d3748;
  margin: 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  border: none;
  background: #f7fafc;
  border-radius: 50%;
  font-size: 24px;
  cursor: pointer;
  color: #718096;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: #4a5568;
  margin-bottom: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #f093fb;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.cancel-btn,
.submit-btn {
  flex: 1;
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
}

.cancel-btn {
  background: #f7fafc;
  color: #4a5568;
}

.submit-btn {
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
}

/* 图片预览模态框 */
.modal-overlay {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.image-preview-modal {
  position: relative;
  width: 90%;
  max-width: 90vw;
  max-height: 90vh;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: zoomIn 0.3s ease-out;
  display: flex;
  flex-direction: column;
}

@keyframes zoomIn {
  from { 
    transform: scale(0.8); 
    opacity: 0;
  }
  to { 
    transform: scale(1); 
    opacity: 1;
  }
}

.preview-container {
  position: relative;
  flex: 1;
  overflow: auto;
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  border-radius: 16px 16px 0 0;
}

.preview-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  cursor: grab;
  position: relative;
}

.preview-content:active {
  cursor: grabbing;
}

.preview-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.1s ease;
  transform-origin: center;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  background: white;
  padding: 20px;
}

.zoom-controls {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  background: rgba(0, 0, 0, 0.7);
  padding: 12px 24px;
  border-radius: 30px;
  z-index: 10;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease 0.1s both;
}

@keyframes slideUp {
  from { 
    transform: translateX(-50%) translateY(20px);
    opacity: 0;
  }
  to { 
    transform: translateX(-50%) translateY(0);
    opacity: 1;
  }
}

.zoom-btn {
  width: 44px;
  height: 44px;
  border: none;
  background: white;
  border-radius: 50%;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
}

.zoom-btn:hover {
  background: #f7fafc;
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.zoom-btn:active {
  transform: scale(0.95);
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 50%;
  font-size: 24px;
  color: white;
  cursor: pointer;
  z-index: 20;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

@media (min-width: 768px) {
  .image-container {
    max-width: 300px;
    margin: 0 auto;
  }
  
  .image-preview-modal {
    max-width: 800px;
  }
}

@media (max-width: 767px) {
  .image-container {
    aspect-ratio: 4/3;
  }
  
  .preview-content {
    padding: 10px;
  }
  
  .preview-image {
    padding: 10px;
  }
  
  .zoom-controls {
    padding: 10px 20px;
  }
  
  .zoom-btn {
    width: 40px;
    height: 40px;
  }
}
</style>
