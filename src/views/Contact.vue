<template>
  <div class="contact">
    <div class="page-header">
      <div class="header-decoration">
        <div class="header-shape shape-1"></div>
        <div class="header-shape shape-2"></div>
        <div class="header-shape shape-3"></div>
      </div>
      <div class="header-content">
        <div class="header-icon">📞</div>
        <div class="header-label">联系我们</div>
        <h1>联系我们</h1>
        <div class="header-divider"></div>
        <p class="header-subtitle">欢迎您的咨询与访问</p>
      </div>
    </div>

    <div class="contact-info">
      <div class="info-card card card-md card-shadow-md">
        <div class="info-item">
          <div class="info-icon">📍</div>
          <div class="info-content">
            <h4>详细地址</h4>
            <p>{{ contact.address }}</p>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">📞</div>
          <div class="info-content">
            <h4>联系电话</h4>
            <a :href="'tel:' + contact.phone" class="link">{{ contact.phone }}</a>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">📧</div>
          <div class="info-content">
            <h4>电子邮箱</h4>
            <a :href="'mailto:' + contact.email" class="link">{{ contact.email }}</a>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">🕐</div>
          <div class="info-content">
            <h4>办公时间</h4>
            <p>{{ contact.workingHours }}</p>
          </div>
        </div>
        <div class="info-item">
          <div class="info-icon">💬</div>
          <div class="info-content">
            <h4>微信公众号</h4>
            <p>{{ contact.wechat }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="map-section">
      <h3 class="section-title">地理位置</h3>
      <div class="map-placeholder">
        <div class="map-icon">🗺️</div>
        <p>点击查看地图位置</p>
        <button class="map-btn">打开地图导航</button>
      </div>
    </div>

    <div class="message-section">
      <h3 class="section-title">留言反馈</h3>
      <div class="message-form">
        <div class="form-item">
          <label>您的姓名</label>
          <input type="text" placeholder="请输入您的姓名">
        </div>
        <div class="form-item">
          <label>联系电话</label>
          <input type="tel" placeholder="请输入您的联系电话">
        </div>
        <div class="form-item">
          <label>留言内容</label>
          <textarea rows="4" placeholder="请输入您的留言内容"></textarea>
        </div>
        <button class="submit-btn">提交留言</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mockData } from '../data/mockData'

export default {
  name: 'Contact',
  data() {
    return {
      contact: mockData.contact
    }
  }
}
</script>

<style scoped>
.contact {
  padding-bottom: 30px;
}

.page-header {
  position: relative;
  background: linear-gradient(135deg, #002fa7 0%, #1e40af 50%, #3b82f6 100%);
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
  background: rgba(255, 255, 255, 0.1);
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
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  letter-spacing: 1px;
}

.header-divider {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #60a5fa, #93c5fd);
  border-radius: 2px;
  margin: 0 auto 12px;
}

.header-subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
}

.contact-info {
  padding: 15px;
}

.info-card {
  padding: 10px 0;
}

.info-item {
  display: flex;
  padding: 18px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.info-item:last-child {
  border-bottom: none;
}

.info-icon {
  font-size: 32px;
  margin-right: 15px;
  flex-shrink: 0;
}

.info-content {
  flex: 1;
}

.info-content h4 {
  font-size: 14px;
  color: #999;
  margin: 0 0 6px;
  font-weight: normal;
}

.info-content p {
  font-size: 15px;
  color: #333;
  margin: 0;
  line-height: 1.5;
}

.link {
  font-size: 15px;
  color: #2196F3;
  text-decoration: none;
}

.map-section,
.message-section {
  padding: 0 15px;
  margin-top: 20px;
}

.section-title {
  font-size: 18px;
  color: #333;
  margin: 0 0 15px;
  font-weight: 600;
  padding-left: 10px;
  border-left: 4px solid #002fa7;
}

.map-placeholder {
  background: white;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.map-icon {
  font-size: 64px;
  margin-bottom: 15px;
}

.map-placeholder p {
  font-size: 15px;
  color: #666;
  margin: 0 0 20px;
}

.map-btn {
  padding: 12px 30px;
  background: linear-gradient(135deg, #002fa7, #3b82f6);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  cursor: pointer;
}

.message-form {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.form-item {
  margin-bottom: 18px;
}

.form-item label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.form-item input,
.form-item textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
}

.form-item input:focus,
.form-item textarea:focus {
  border-color: #002fa7;
}

.submit-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #002fa7, #3b82f6);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.submit-btn:active {
  opacity: 0.8;
}
</style>
