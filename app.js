App({
  globalData: {
    userInfo: null,
    hasLogin: false,
    baseUrl: 'http://localhost:8080',
    token: '',
    location: null
  },

  onLaunch() {
    // 检查登录状态
    this.checkLoginStatus();
    
    // 获取用户位置
    this.getUserLocation();
    
    // 检查更新
    this.checkUpdate();
  },

  onShow() {
    console.log('App Show');
  },

  onHide() {
    console.log('App Hide');
  },

  // 检查登录状态
  checkLoginStatus() {
    const token = wx.getStorageSync('token');
    if (token) {
      this.globalData.token = token;
      this.globalData.hasLogin = true;
      this.getUserInfo();
    }
  },

  // 获取用户信息
  getUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.globalData.userInfo = userInfo;
    }
  },

  // 获取用户位置
  getUserLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: (res) => {
        this.globalData.location = {
          latitude: res.latitude,
          longitude: res.longitude
        };
      },
      fail: (err) => {
        console.log('获取位置失败:', err);
      }
    });
  },

  // 检查更新
  checkUpdate() {
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate((res) => {
        if (res.hasUpdate) {
          updateManager.onUpdateReady(() => {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: (res) => {
                if (res.confirm) {
                  updateManager.applyUpdate();
                }
              }
            });
          });
        }
      });
    }
  },

  // 登录方法
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          if (res.code) {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: `${this.globalData.baseUrl}/login`,
              method: 'POST',
              data: {
                code: res.code
              },
              success: (loginRes) => {
                if (loginRes.data.success) {
                  this.globalData.token = loginRes.data.token;
                  this.globalData.hasLogin = true;
                  wx.setStorageSync('token', loginRes.data.token);
                  resolve(loginRes.data);
                } else {
                  reject(loginRes.data.message);
                }
              },
              fail: reject
            });
          } else {
            reject('登录失败');
          }
        },
        fail: reject
      });
    });
  },

  // 退出登录
  logout() {
    this.globalData.userInfo = null;
    this.globalData.hasLogin = false;
    this.globalData.token = '';
    wx.removeStorageSync('token');
    wx.removeStorageSync('userInfo');
    wx.reLaunch({
      url: '/pages/index/index'
    });
  }
}); 