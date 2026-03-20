<template>
  <div class="products">
    <div v-if="showHeader" class="page-header">
      <div class="header-decoration">
        <div class="header-shape shape-1"></div>
        <div class="header-shape shape-2"></div>
        <div class="header-shape shape-3"></div>
      </div>
      <div class="header-content">
        <div class="header-icon">🥬</div>
        <div class="header-label">绿色农业</div>
        <h1>特色农产品</h1>
        <div class="header-divider"></div>
        <p class="header-subtitle">绿色生态，品质保证</p>
      </div>
    </div>

    <div class="products-list" :class="{ 'in-home': !showHeader }">
      <div class="product-item" v-for="product in products" :key="product.id">
        <div class="product-icon">{{ product.icon || '🌾' }}</div>
        <div class="product-content">
          <h3 class="product-name">{{ product.name }}</h3>
          <p class="product-desc">{{ product.description }}</p>
        </div>
      </div>
    </div>

    <div v-if="showHeader" class="tips-section">
      <div class="tips-card">
        <div class="tips-icon">💡</div>
        <h3>产品介绍</h3>
        <ul>
          <li>所有产品均为本地农户自产自销</li>
          <li>绿色种植，无农药残留</li>
          <li>如需了解详情请联系村委会或拨打服务热线</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mockData } from '../data/mockData'

export default {
  name: 'Products',
  props: {
    showHeader: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      products: mockData.products
    }
  }
}
</script>

<style scoped>
.products {
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

.products-list {
  padding: 15px;
}

.products-list.in-home {
  padding: 0;
}

.products-list.in-home .product-item {
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.products-list.in-home .product-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 47, 167, 0.1);
  border-color: #002fa7;
}

.products-list.in-home .product-name {
  color: #1a1a1a;
}

.products-list.in-home .product-name::after {
  background: linear-gradient(90deg, #e0e7ff, transparent);
}

.products-list.in-home .product-desc {
  color: #4a5568;
}

.product-item {
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: flex-start;
  gap: 16px;
  transition: all 0.3s ease;
  border-left: 4px solid #002fa7;
}

.product-item:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 20px rgba(0, 47, 167, 0.12);
}

.product-icon {
  font-size: 48px;
  flex-shrink: 0;
  line-height: 1;
}

.product-content {
  flex: 1;
}

.product-name {
  font-size: 18px;
  color: #1a1a1a;
  margin: 0 0 10px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

.product-name::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, #e0e7ff, transparent);
}

.product-desc {
  font-size: 15px;
  color: #4a5568;
  margin: 0;
  line-height: 1.8;
}

.tips-section {
  padding: 0 15px;
  margin-top: 10px;
}

.tips-card {
  background: linear-gradient(135deg, #f0f4ff 0%, #e8ecff 100%);
  border-radius: 16px;
  padding: 24px;
  border-left: 4px solid #002fa7;
}

.tips-icon {
  font-size: 32px;
  margin-bottom: 12px;
}

.tips-card h3 {
  font-size: 18px;
  color: #1a1a1a;
  margin: 0 0 16px;
  font-weight: 700;
}

.tips-card ul {
  margin: 0;
  padding-left: 20px;
}

.tips-card li {
  font-size: 15px;
  color: #4a5568;
  margin-bottom: 10px;
  line-height: 1.7;
}
</style>
