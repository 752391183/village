<template>
  <ArticleDetail 
    :article="news" 
    :relatedArticles="relatedNews"
    backText="返回新闻"
    @goBack="goBack"
    @goToDetail="goToDetail"
  />
</template>

<script>
import { mockData } from '../data/mockData'
import ArticleDetail from '../components/ArticleDetail.vue'

export default {
  name: 'NewsDetail',
  components: {
    ArticleDetail
  },
  data() {
    return {
      news: null
    }
  },
  computed: {
    relatedNews() {
      if (!this.news) return []
      return mockData.news.filter(n => n.id !== this.news.id).slice(0, 2)
    }
  },
  mounted() {
    const newsId = Number(this.$route.params.id)
    this.news = mockData.news.find(n => n.id === newsId)
  },
  methods: {
    goBack() {
      this.$router.push('/news')
    },
    goToDetail(id) {
      this.$router.push(`/news/${id}`)
      window.scrollTo(0, 0)
    }
  }
}
</script>
