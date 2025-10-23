const app = getApp();

Page({
  data: {
    carpoolList: [],
    searchKeyword: '',
    currentFilter: 'all',
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10
  },

  onLoad(options) {
    this.loadCarpoolList();
  },

  onShow() {
    this.loadCarpoolList();
  },

  onPullDownRefresh() {
    this.setData({
      page: 1,
      hasMore: true
    });
    this.loadCarpoolList();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore();
    }
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 搜索
  search() {
    this.setData({
      page: 1,
      hasMore: true
    });
    this.loadCarpoolList();
  },

  // 设置筛选
  setFilter(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({
      currentFilter: filter,
      page: 1,
      hasMore: true
    });
    this.loadCarpoolList();
  },

  // 加载拼车列表
  loadCarpoolList() {
    this.setData({ loading: true });
    
    // 模拟数据，实际应该从API获取
    const mockData = [
      {
        id: 1,
        username: '张三',
        avatar: '/images/头像.png',
        time: '2小时前',
        departure: '湖州学院',
        destination: '湖州火车站',
        departureTime: '明天 08:00',
        price: 15,
        carType: '轿车',
        availableSeats: 3,
        likes: 12,
        collects: 5
      },
      {
        id: 2,
        username: '李四',
        avatar: '/images/头像.png',
        time: '4小时前',
        departure: '湖州学院',
        destination: '杭州东站',
        departureTime: '后天 09:30',
        price: 25,
        carType: 'SUV',
        availableSeats: 2,
        likes: 8,
        collects: 3
      },
      {
        id: 3,
        username: '王五',
        avatar: '/images/头像.png',
        time: '6小时前',
        departure: '湖州学院',
        destination: '上海虹桥',
        departureTime: '明天 14:00',
        price: 35,
        carType: '轿车',
        availableSeats: 1,
        likes: 15,
        collects: 7
      }
    ];

    setTimeout(() => {
      this.setData({
        carpoolList: mockData,
        loading: false
      });
      wx.stopPullDownRefresh();
    }, 1000);
  },

  // 加载更多
  loadMore() {
    if (this.data.loading || !this.data.hasMore) return;
    
    this.setData({ 
      loading: true,
      page: this.data.page + 1
    });
    
    // 模拟加载更多数据
    setTimeout(() => {
      const moreData = [
        {
          id: 4,
          username: '赵六',
          avatar: '/images/头像.png',
          time: '8小时前',
          departure: '湖州学院',
          destination: '南京南站',
          departureTime: '明天 10:00',
          price: 30,
          carType: '面包车',
          availableSeats: 4,
          likes: 6,
          collects: 2
        }
      ];
      
      this.setData({
        carpoolList: [...this.data.carpoolList, ...moreData],
        loading: false,
        hasMore: false // 模拟没有更多数据
      });
    }, 1000);
  },

  // 查看详情
  viewDetail(e) {
    const item = e.currentTarget.dataset.item;
    // 这里可以跳转到详情页面
    wx.showModal({
      title: '拼车详情',
      content: `出发地：${item.departure}\n目的地：${item.destination}\n时间：${item.departureTime}\n价格：¥${item.price}\n车型：${item.carType}\n剩余座位：${item.availableSeats}`,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 点赞拼车
  likeCarpool(e) {
    const id = e.currentTarget.dataset.id;
    // 这里应该调用API
    wx.showToast({
      title: '点赞成功',
      icon: 'success'
    });
  },

  // 收藏拼车
  collectCarpool(e) {
    const id = e.currentTarget.dataset.id;
    // 这里应该调用API
    wx.showToast({
      title: '收藏成功',
      icon: 'success'
    });
  },

  // 分享拼车
  shareCarpool(e) {
    const item = e.currentTarget.dataset.item;
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: '湖院通 - 校园拼车',
      path: '/pages/carpool/list/list',
      imageUrl: '/images/share-cover.png'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '湖院通 - 校园拼车',
      imageUrl: '/images/share-cover.png'
    };
  },

  // 跳转到拼车发布页
  goToPublish() {
    wx.navigateTo({
      url: '/pages/carpool/publish/publish'
    });
  },

  // 显示筛选
  showFilter() {
    wx.showToast({
      title: '筛选功能开发中',
      icon: 'none'
    });
  }
}); 