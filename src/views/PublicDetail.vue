<template>
  <ArticleDetail 
    :article="publicItem" 
    :relatedArticles="relatedItems"
    backText="返回村务公开"
    relatedTitle="相关信息"
    @goBack="goBack"
    @goToDetail="goToDetail"
  />
</template>

<script>
import { mockData } from '../data/mockData'
import ArticleDetail from '../components/ArticleDetail.vue'

export default {
  name: 'PublicDetail',
  components: {
    ArticleDetail
  },
  data() {
    return {
      publicItem: null,
      relatedItems: []
    }
  },
  mounted() {
    this.loadPublicItem()
  },
  methods: {
    loadPublicItem() {
      const id = parseInt(this.$route.params.id)
      const publicItem = mockData.publicInfo.find(item => item.id === id)
      
      if (publicItem) {
        this.publicItem = publicItem
        this.loadRelatedItems(publicItem.category)
      }
    },
    loadRelatedItems(category) {
      this.relatedItems = mockData.publicInfo
        .filter(item => item.category === category && item.id !== parseInt(this.$route.params.id))
        .slice(0, 3)
    },
    goBack() {
      this.$router.push('/public')
    },
    goToDetail(id) {
      this.$router.push(`/public/${id}`)
    }
  }
}
</script>