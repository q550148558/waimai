<template>
  <div class="dashboard-container">
    <div class="dashboard-text">欢迎使用</div>
  </div>
</template>

<script>
import Cookie from 'js-cookie'
export default {
  name: 'Dashboard',
  computed: {
    name() {
      return Cookie.get('userName')
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
