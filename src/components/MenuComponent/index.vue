<template>
  <div>
  <div style="display: flex;width: 100vw;height: 80px;padding-bottom: 20px" >
<div style="display: flex;justify-content: center;align-items: center;height: 100px;padding-bottom: 20px;width: 15vw">家庭收支管理系统</div>
    <div class="home-header-menu" style="width: 75vw;">
      <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
      >
        <el-menu-item index="/project/home">首页</el-menu-item>


      </el-menu>
    </div>

    <el-dropdown @command="clickmenu">
        <span class="el-dropdown-link ">
    <div style="display: flex;justify-content: center;align-items: center;height: 100px;padding-bottom: 20px;width: 10vw">
      {{ nickname }}</div>
        </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="outlogin">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  props: {
    activeIndexProp: {
      type: String,
      default: "1",
    },
    activeIndex2Prop: {
      type: String,
      default: "1",
    }
  },
  data() {
    return {
      nickname:JSON.parse(localStorage.getItem("userInfo")).userNickname,
      activeIndex: this.activeIndexProp,
      activeIndex2: this.activeIndex2Prop,
    };
  },
  methods: {
    // 点击下拉菜单回调
    clickmenu(e) {
      if (e === 'outlogin') {
        this.outLogin()
      }
    },
    // 退出登录
    outLogin() {
      localStorage.removeItem('userInfo')
       this.$router.push('/login')
    },
    handleSelect(key, keyPath) {
       this.$router.push(key)
      console.log("Selected menu item:", key, keyPath);
    },
  },
};
</script>

<style scoped>

.el-menu-demo {
  margin-bottom: 20px;
}

.home-header-menu .el-menu--horizontal>.el-menu-item {
  font-size: 20px;
  height: 100px;
  line-height: 100px;
}
.home-header-menu .el-menu--horizontal>.el-submenu .el-submenu__title {
  font-size: 20px;
  height: 100px;
  line-height: 100px;
}
</style>
