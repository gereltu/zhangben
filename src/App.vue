<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  methods: {
    changeFavicon(link) {
      let $favicon = document.querySelector('link[rel="icon"]')
      if ($favicon !== null) {
        $favicon.href = link
      } else {
        $favicon = document.createElement('link')
        $favicon.rel = 'icon'
        $favicon.href = link
        document.head.appendChild($favicon)
      }
    },
  },
  watch: {
    $route: function () {
      let userInfo = localStorage.getItem('userInfo')
      if (userInfo) {
        userInfo = JSON.parse(userInfo)
        this.changeFavicon(userInfo.iconImage)
      }else{
        this.changeFavicon('../public/favicon.ico')
      }
    },
  },
}
</script>

<style>
body {
  margin: 0px auto;
  padding: 0px;
  color: #606266 !important;
}
.page-content {
  margin: 15px;
  padding: 15px;
  box-sizing: border-box;
  background-color: white;
  overflow: auto;
}
</style>

