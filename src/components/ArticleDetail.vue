<template>
  <div class="article-detail">
    <div class="reading-progress" :style="{ width: scrollProgress + '%' }"></div>
    
    <div class="nav-bar">
      <button class="nav-back" @click="goBack">
        <span class="nav-icon">←</span>
        {{ backText }}
      </button>
    </div>

    <div v-if="article" class="article-container">
      <header class="article-header">
        <div class="article-category">{{ article.category || '文章' }}</div>
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <div class="author-info">
            <div class="author-avatar">👤</div>
            <div class="author-details">
              <span class="author-name">{{ authorName }}</span>
              <span class="author-role">{{ authorRole }}</span>
            </div>
          </div>
          <div class="meta-stats">
            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <span class="meta-text">{{ article.date }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">👁️</span>
              <span class="meta-text">{{ Math.floor(Math.random() * 500) + 100 }} 阅读</span>
            </div>
          </div>
        </div>
      </header>

      <div v-if="article.image" class="article-cover">
        <img :src="article.image" :alt="article.title">
      </div>

      <article class="article-content">
        <div v-for="(paragraph, index) in contentParagraphs" :key="index" class="article-paragraph">
          <p>{{ paragraph }}</p>
        </div>
      </article>

      <div class="article-tags" v-if="showTags">
        <span class="tag-item" v-for="(tag, index) in tags" :key="index">#{{ tag }}</span>
      </div>

      <div class="article-divider"></div>

      <section class="related-section" v-if="relatedArticles.length > 0">
        <h3 class="related-title">{{ relatedTitle }}</h3>
        <div class="related-list">
          <div 
            v-for="item in relatedArticles" 
            :key="item.id" 
            class="related-item"
            @click="goToDetail(item.id)"
          >
            <div v-if="item.image" class="related-image">
              <img :src="item.image" :alt="item.title">
            </div>
            <div class="related-info">
              <h4 class="related-item-title">{{ item.title }}</h4>
              <span class="related-item-date">{{ item.date }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div v-else class="not-found">
      <div class="not-found-icon">📭</div>
      <p>文章不存在</p>
      <button class="back-btn-primary" @click="goBack">{{ backText }}</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleDetail',
  props: {
    article: {
      type: Object,
      default: null
    },
    relatedArticles: {
      type: Array,
      default: () => []
    },
    backText: {
      type: String,
      default: '返回列表'
    },
    authorName: {
      type: String,
      default: '村委会'
    },
    authorRole: {
      type: String,
      default: '官方发布'
    },
    showTags: {
      type: Boolean,
      default: true
    },
    tags: {
      type: Array,
      default: () => ['乡村振兴', '美丽新农村', '幸福村']
    },
    relatedTitle: {
      type: String,
      default: '相关推荐'
    }
  },
  data() {
    return {
      scrollProgress: 0
    }
  },
  computed: {
    contentParagraphs() {
      if (!this.article?.content) return []
      return this.article.content.split('\n')
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    goBack() {
      this.$emit('goBack')
    },
    goToDetail(id) {
      this.$emit('goToDetail', id)
    },
    handleScroll() {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      this.scrollProgress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
    }
  }
}
</script>

<style scoped>
.article-detail {
  min-height: 100vh;
  background: #fafafa;
  padding-bottom: 60px;
}

.reading-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #002fa7, #3b82f6);
  z-index: 1000;
  transition: width 0.1s ease;
}

.nav-bar {
  position: sticky;
  top: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 12px 20px;
  border-bottom: 1px solid #e8e8e8;
  z-index: 100;
}

.nav-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  color: #333;
  font-size: 15px;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s;
}

.nav-back:hover {
  background: #f0f0f0;
}

.nav-icon {
  font-size: 18px;
  line-height: 1;
}

.article-container {
  max-width: 720px;
  margin: 0 auto;
  padding: 32px 20px 0;
}

.article-header {
  margin-bottom: 28px;
}

.article-category {
  display: inline-block;
  font-size: 13px;
  font-weight: 600;
  color: #002fa7;
  background: linear-gradient(135deg, rgba(0, 47, 167, 0.1), rgba(59, 130, 246, 0.1));
  padding: 6px 14px;
  border-radius: 20px;
  margin-bottom: 16px;
  letter-spacing: 0.5px;
}

.article-title {
  font-size: 32px;
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1.4;
  margin: 0 0 20px;
  letter-spacing: -0.3px;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #e8e8e8;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #002fa7, #3b82f6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.author-name {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.author-role {
  font-size: 13px;
  color: #999;
}

.meta-stats {
  display: flex;
  gap: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
}

.meta-icon {
  font-size: 16px;
}

.article-cover {
  width: 100%;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 36px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.article-cover img {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 16/9;
  object-fit: cover;
}

.article-content {
  background: white;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 28px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
}

.article-paragraph {
  margin-bottom: 24px;
}

.article-paragraph:last-child {
  margin-bottom: 0;
}

.article-paragraph p {
  font-size: 17px;
  color: #333;
  line-height: 1.9;
  margin: 0;
  text-indent: 2em;
  letter-spacing: 0.3px;
}

.article-tags {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 36px;
  padding: 0 4px;
}

.tag-item {
  font-size: 14px;
  color: #666;
  background: #f0f0f0;
  padding: 8px 16px;
  border-radius: 20px;
  transition: all 0.3s;
  cursor: pointer;
}

.tag-item:hover {
  background: linear-gradient(135deg, rgba(0, 47, 167, 0.1), rgba(59, 130, 246, 0.1));
  color: #002fa7;
}

.article-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e8e8e8, transparent);
  margin-bottom: 36px;
}

.related-section {
  margin-bottom: 28px;
}

.related-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 20px;
  padding-left: 12px;
  border-left: 4px solid #002fa7;
}

.related-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.related-item {
  display: flex;
  gap: 16px;
  background: white;
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.related-item:hover {
  transform: translateX(4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.related-image {
  width: 120px;
  height: 90px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.related-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-width: 0;
}

.related-item-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.related-item-date {
  font-size: 13px;
  color: #999;
}

.not-found {
  text-align: center;
  padding: 100px 20px;
}

.not-found-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.not-found p {
  font-size: 16px;
  color: #999;
  margin: 0 0 32px;
}

.back-btn-primary {
  padding: 14px 48px;
  background: linear-gradient(135deg, #002fa7, #3b82f6);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.back-btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 47, 167, 0.3);
}

@media (max-width: 640px) {
  .article-title {
    font-size: 24px;
  }

  .article-content {
    padding: 24px 20px;
  }

  .article-paragraph p {
    font-size: 16px;
  }

  .related-image {
    width: 100px;
    height: 75px;
  }

  .meta-stats {
    width: 100%;
    justify-content: flex-start;
  }
}
</style>