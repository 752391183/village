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
        <div class="gallery-item">
          <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=village%20cultural%20square%20with%20people%20dancing&image_size=square" alt="文化广场">
        </div>
        <div class="gallery-item">
          <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20village%20community%20center&image_size=square" alt="社区中心">
        </div>
        <div class="gallery-item">
          <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=agricultural%20greenhouses%20in%20village&image_size=square" alt="农业大棚">
        </div>
        <div class="gallery-item">
          <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20countryside%20road%20with%20trees&image_size=square" alt="乡村道路">
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
      overview: mockData.overview
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
</style>
