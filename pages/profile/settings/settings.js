const app = getApp();

Page({
  data: {
    hasLogin: false
  },

  onLoad() {
    this.checkLoginStatus();
  },

  onShow() {
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus() {
    this.setData({
      hasLogin: app.globalData.hasLogin
    });
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '确认清除',
      content: '确定要清除所有缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          wx.clearStorage({
            success: () => {
              wx.showToast({
                title: '清除成功',
                icon: 'success'
              });
            },
            fail: () => {
              wx.showToast({
                title: '清除失败',
                icon: 'error'
              });
            }
          });
        }
      }
    });
  },

  // 关于我们
  aboutUs() {
    wx.showModal({
      title: '关于湖院通',
      content: '湖院通 v1.0.0\n\n湖州学院校园生活服务平台\n\n提供拼车、卖书、论坛等功能\n\n开发团队：湖州学院学生团队\n\n联系方式：\n微信：huyuantong_service\n邮箱：service@huyuantong.com',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 意见反馈
  feedback() {
    wx.showModal({
      title: '意见反馈',
      content: '如有问题或建议，请联系我们：\n\n微信：15057486855\n邮箱：2104170424@qq.com\n\n工作时间：9:00-18:00',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          app.logout();
          wx.showToast({
            title: '已退出登录',
            icon: 'success'
          });
        }
      }
    });
  }
}); 