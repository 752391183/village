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
        @click="activeTab = 'all'"
      >
        全部
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === '婚宴' }" 
        @click="activeTab = '婚宴'"
      >
        婚宴
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === '寿宴' }" 
        @click="activeTab = '寿宴'"
      >
        寿宴
      </div>
      <div 
        class="tab-item" 
        :class="{ active: activeTab === '满月酒' }" 
        @click="activeTab = '满月酒'"
      >
        满月酒
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
        <p class="banquet-desc">{{ banquet.description }}</p>
        <div class="menu-section">
          <div class="menu-title">🍽️ 菜单预览：</div>
          <div class="menu-tags">
            <span v-for="(dish, idx) in banquet.menu" :key="idx" class="menu-tag">{{ dish }}</span>
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
      menuInput: ''
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
  background: linear-gradient(135deg, #f093fb, #f5576c);
  color: white;
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
</style>
