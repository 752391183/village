<template>
  <div class="service">
    <div class="page-header">
      <div class="header-decoration">
        <div class="header-shape shape-1"></div>
        <div class="header-shape shape-2"></div>
        <div class="header-shape shape-3"></div>
      </div>
      <div class="header-content">
        <div class="header-icon">🛠️</div>
        <div class="header-label">便民服务</div>
        <h1>便民服务</h1>
        <div class="header-divider"></div>
        <p class="header-subtitle">服务村民，便利生活</p>
      </div>
    </div>

    <div class="service-list">
      <div class="service-card" v-for="service in services" :key="service.id">
        <div class="service-header">
          <div class="service-icon">{{ service.icon }}</div>
          <h3 class="service-title">{{ service.title }}</h3>
        </div>
        <p class="service-desc">{{ service.description }}</p>
        <div class="service-contact">
          <span class="contact-label">联系方式：</span>
          <span class="contact-value">{{ service.contact }}</span>
        </div>
        <button class="service-btn">在线咨询</button>
      </div>
    </div>

    <div class="emergency-section">
      <div class="emergency-card">
        <div class="emergency-icon">🚨</div>
        <h3>紧急联系电话</h3>
        <div class="emergency-list">
          <div class="emergency-item">
            <span class="emergency-name">报警电话</span>
            <a href="tel:110" class="emergency-phone">110</a>
          </div>
          <div class="emergency-item">
            <span class="emergency-name">急救电话</span>
            <a href="tel:120" class="emergency-phone">120</a>
          </div>
          <div class="emergency-item">
            <span class="emergency-name">火警电话</span>
            <a href="tel:119" class="emergency-phone">119</a>
          </div>
          <div class="emergency-item">
            <span class="emergency-name">村委会</span>
            <a href="tel:010-12345678" class="emergency-phone">010-12345678</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mockData } from '../data/mockData'

export default {
  name: 'Service',
  data() {
    return {
      services: mockData.services
    }
  }
}
</script>

<style scoped>
.service {
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

.service-list {
  padding: 15px;
}

.service-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.service-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.service-icon {
  font-size: 36px;
  margin-right: 12px;
}

.service-title {
  font-size: 18px;
  color: #333;
  margin: 0;
  font-weight: 600;
}

.service-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 15px;
}

.service-contact {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 15px;
}

.contact-label {
  font-size: 13px;
  color: #999;
}

.contact-value {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.service-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #002fa7, #3b82f6);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.service-btn:active {
  opacity: 0.8;
}

.emergency-section {
  padding: 0 15px;
  margin-top: 10px;
}

.emergency-card {
  background: #FFEBEE;
  border-radius: 12px;
  padding: 20px;
  border-left: 4px solid #F44336;
}

.emergency-icon {
  font-size: 32px;
  margin-bottom: 10px;
}

.emergency-card h3 {
  font-size: 16px;
  color: #333;
  margin: 0 0 15px;
}

.emergency-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.emergency-item {
  background: white;
  border-radius: 8px;
  padding: 12px;
  text-align: center;
}

.emergency-name {
  display: block;
  font-size: 13px;
  color: #666;
  margin-bottom: 5px;
}

.emergency-phone {
  display: block;
  font-size: 18px;
  color: #F44336;
  font-weight: bold;
  text-decoration: none;
}
</style>
