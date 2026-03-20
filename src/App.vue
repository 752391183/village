<template>
  <div id="app">
    <router-view />
    <BottomNav />
  </div>
</template>

<script>
import BottomNav from './components/BottomNav.vue'

export default {
  name: 'App',
  components: {
    BottomNav
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f5f5f5;
  min-height: 100vh;
  padding-bottom: 70px;
  padding-bottom: calc(70px + env(safe-area-inset-bottom));
}
</style>
