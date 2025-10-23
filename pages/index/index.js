const app = getApp();

Page({
  data: {
    latestItems: [],
    loading: false
  },

  onLoad() {
    this.loadLatestItems();
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadLatestItems();
  },

  onPullDownRefresh() {
    this.loadLatestItems();
  },

  // 加载最新动态
  loadLatestItems() {
    this.setData({ loading: true });
    
    // 模拟数据，实际应该从API获取
    const mockData = [
      {
        id: 1,
        title: '寻找拼车伙伴',
        description: '明天去火车站，有一起的吗？',
        time: '2小时前',
        type: '拼车',
        avatar: '/images/头像.png'
      },
      {
        id: 2,
        title: '出售高等数学教材',
        description: '九成新，价格优惠',
        time: '4小时前',
        type: '卖书',
        avatar: '/images/头像.png'
      },
      {
        id: 3,
        title: '关于食堂饭菜的讨论',
        description: '大家觉得新食堂怎么样？',
        time: '6小时前',
        type: '论坛',
        avatar: '/images/头像.png'
      }
    ];

    setTimeout(() => {
      this.setData({
        latestItems: mockData,
        loading: false
      });
      wx.stopPullDownRefresh();
    }, 1000);
  },

  // 导航到拼车模块
  navigateToCarpool() {
    wx.navigateTo({
      url: '/pages/carpool/list/list'
    });
  },

  // 导航到拼车发布
  navigateToCarpoolPublish() {
    if (!app.globalData.hasLogin) {
      this.showLoginTip();
      return;
    }
    wx.navigateTo({
      url: '/pages/carpool/publish/publish'
    });
  },

  // 导航到拼车列表
  navigateToCarpoolList() {
    wx.navigateTo({
      url: '/pages/carpool/list/list'
    });
  },

  // 导航到卖书模块
  navigateToBooks() {
    wx.navigateTo({
      url: '/pages/books/list/list'
    });
  },

  // 导航到卖书发布
  navigateToBooksPublish() {
    if (!app.globalData.hasLogin) {
      this.showLoginTip();
      return;
    }
    wx.navigateTo({
      url: '/pages/books/publish/publish'
    });
  },

  // 导航到卖书列表
  navigateToBooksList() {
    wx.navigateTo({
      url: '/pages/books/list/list'
    });
  },

  //导航到闲置物品模块
  navigateToThings() {
    wx.navigateTo({
      url: '/pages/else/list/list'
    });
  },

  //导航到闲置物品发布
  navigateToThingsPublish() {
    if (!app.globalData.hasLogin) {
      this.showLoginTip();
      return;
    }
    wx.navigateTo({
      url: '/pages/else/publish/publish'
    });
  },

  //导航到闲置物品列表
  navigateToThingsList() {
    wx.navigateTo({
      url: '/pages/else/list/list'
    });
  },

  // 导航到论坛模块
  navigateToForum() {
    wx.switchTab({
      url: '/pages/forum/list/list'
    });
  },

  // 导航到论坛发布
  navigateToForumPublish() {
    if (!app.globalData.hasLogin) {
      this.showLoginTip();
      return;
    }
    wx.navigateTo({
      url: '/pages/forum/publish/publish'
    });
  },

  // 导航到论坛列表
  navigateToForumList() {
    wx.navigateTo({
      url: '/pages/forum/list/list'
    });
  },

  // 查看详情
  viewDetail(e) {
    const item = e.currentTarget.dataset.item;
    // 根据类型跳转到不同页面
    switch (item.type) {
      case '拼车':
        wx.navigateTo({
          url: `/pages/carpool/list/list?id=${item.id}`
        });
        break;
      case '卖书':
        wx.navigateTo({
          url: `/pages/books/list/list?id=${item.id}`
        });
        break;
      case '论坛':
        wx.navigateTo({
          url: `/pages/forum/list/list?id=${item.id}`
        });
        break;
    }
  },

  // 查看更多
  viewMore() {
    wx.switchTab({
      url: '/pages/forum/forum'
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

  // 反馈功能
  feedback() {
    wx.navigateTo({
      url: '/pages/profile/settings/settings'
    });
  },

  // 显示通知
  showNotifications() {
    wx.showToast({
      title: '暂无新通知',
      icon: 'none'
    });
  },

  // 显示设置
  showSettings() {
    wx.navigateTo({
      url: '/pages/profile/settings/settings'
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
          wx.switchTab({
            url: '/pages/profile/profile'
          });
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