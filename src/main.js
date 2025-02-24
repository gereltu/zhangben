import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import App from "./App.vue";
import router from "./router";
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
import FileUpload from "@/components/FileUpload"

Vue.config.productionTip = false;

/**
 * 配置全局loading提示框
 * 显示loading this.showLoading()
 * 关闭loading this.hideLoading()
 */
Vue.prototype.loading = null
Vue.prototype.showLoading = function (msg = 'Loading') {
  Vue.prototype.loading = this.$loading({
    lock: true,
    text: msg,
    spinner: 'el-icon-loading',
    background: 'rgba(0, 0, 0, 0.7)'
  });
}
Vue.prototype.hideLoading = function () {
  Vue.prototype.loading.close();
}

Vue.prototype.msgsuccess = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: "success"
  });
}

Vue.prototype.msgerror = function (msg) {
  this.$message({
    showClose: true,
    message: msg,
    type: "error"
  });
}

Vue.prototype.msginfo = function (msg) {
  this.$message.info(msg);
}

//全局修改弹窗黑幕点击关闭弹窗默认组件的配置
ElementUI.Dialog.props.appendToBody.default = true




//设置ElementUI组件的默认大小
Vue.use(ElementUI, {
  size: 'medium'
})

Vue.component('ImageUpload', ImageUpload)
Vue.component('FileUpload', FileUpload)


new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
