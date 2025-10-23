const app = getApp();

Page({
  data: {
    userInfo: null,
    hasLogin: false,
  },

  onLoad() {
    this.checkLoginStatus();
  },

  onShow() {
    this.checkLoginStatus();
  },

  // 检查登录状态
  checkLoginStatus() {
    const hasLogin = app.globalData.hasLogin;
    const userInfo = app.globalData.userInfo;
    
    this.setData({
      hasLogin: hasLogin,
      userInfo: userInfo
    });
  },

  // 登录
  login() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        
        // 调用登录接口
        app.login().then(() => {
          // 保存用户信息
          userInfo.userId = 'U' + Date.now();
          userInfo.posts = 0;
          userInfo.collects = 0;
          userInfo.likes = 0;
          
          app.globalData.userInfo = userInfo;
          wx.setStorageSync('userInfo', userInfo);
          
          this.setData({
            userInfo: userInfo,
            hasLogin: true,
          });
          
          wx.showToast({
            title: '登录成功',
            icon: 'success'
          });
        }).catch((err) => {
          console.log('登录失败:', err);
          wx.showToast({
            title: '登录失败',
            icon: 'error'
          });
        });
      },
      fail: (err) => {
        console.log('获取用户信息失败:', err);
        wx.showToast({
          title: '获取用户信息失败',
          icon: 'error'
        });
      }
    });
  },

  // 导航到个人信息
  navigateToPersonalInfo() {
    if (!this.data.hasLogin) {
      this.showLoginTip();
      return;
    }
    wx.navigateTo({
      url: '/pages/profile/personal-info/personal-info'
    });
  },

  // 导航到我的发布
  navigateToMyPosts() {
    if (!this.data.hasLogin) {
      this.showLoginTip();
      return;
    }
    wx.navigateTo({
      url: '/pages/profile/my-posts/my-posts'
    });
  },

  // 导航到我的收藏
  navigateToMyCollects() {
    if (!this.data.hasLogin) {
      this.showLoginTip();
      return;
    }
    wx.navigateTo({
      url: '/pages/profile/my-collects/my-collects'
    });
  },

  // 导航到设置
  navigateToSettings() {
    wx.navigateTo({
      url: '/pages/profile/settings/settings'
    });
  },

  // 导航到关于我们
  navigateToAbout() {
    wx.navigateTo({
      url: '/pages/profile/about/about'
    });
  },

  // 意见反馈
  feedback() {
    wx.showModal({
      title: '意见反馈',
      content: '如有问题或建议，请联系客服：\n微信：huyuantong_service\n邮箱：service@huyuantong.com',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 扫码功能
  scanCode() {
    wx.scanCode({
      success: (res) => {
        console.log('扫码结果:', res);
        wx.showToast({
          title: '扫码成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.log('扫码失败:', err);
        wx.showToast({
          title: '扫码失败',
          icon: 'error'
        });
      }
    });
  },

  // 分享应用
  shareApp() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 联系客服
  contactService() {
    wx.showModal({
      title: '联系客服',
      content: '客服微信：huyuantong_service\n工作时间：9:00-18:00',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 评价应用
  rateApp() {
    wx.showModal({
      title: '评价应用',
      content: '感谢您的使用！如果觉得好用，请给我们一个好评吧！',
      confirmText: '去评价',
      success: (res) => {
        if (res.confirm) {
          // 这里可以跳转到应用商店评价页面
          wx.showToast({
            title: '感谢您的评价',
            icon: 'success'
          });
        }
      }
    });
  },

  // 显示登录提示
  showLoginTip() {
    wx.showModal({
      title: '提示',
      content: '请先登录后再使用此功能',
      confirmText: '去登录',
      success: (res) => {
        if (res.confirm) {
          this.login();
        }
      }
    });
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: '湖院通 - 校园生活服务平台',
      path: '/pages/index/index',
      imageUrl: '/images/share-cover.png'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '湖院通 - 校园生活服务平台',
      imageUrl: '/images/share-cover.png'
    };
  }
}); 