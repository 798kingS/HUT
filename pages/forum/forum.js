const app = getApp();

Page({
  data: {
    currentTab: 0,
    carpoolList: [],
    booksList: [],
    forumList: [],
    loading: false
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    this.loadData();
  },

  onPullDownRefresh() {
    this.loadData();
  },

  // 切换标签
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    });
    this.loadData();
  },

  // 加载数据
  loadData() {
    this.setData({ loading: true });
    
    // 根据当前标签加载不同数据
    switch (this.data.currentTab) {
      case 0:
        this.loadCarpoolData();
        break;
      case 1:
        this.loadBooksData();
        break;
      case 2:
        this.loadForumData();
        break;
    }
  },

  // 加载拼车数据
  loadCarpoolData() {
    // 模拟数据
    const mockData = [
      {
        id: 1,
        username: '张三',
        avatar: '/images/avatar1.png',
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
        avatar: '/images/avatar2.png',
        time: '4小时前',
        departure: '湖州学院',
        destination: '杭州东站',
        departureTime: '后天 09:30',
        price: 25,
        carType: 'SUV',
        availableSeats: 2,
        likes: 8,
        collects: 3
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

  // 加载卖书数据
  loadBooksData() {
    // 模拟数据
    const mockData = [
      {
        id: 1,
        title: '高等数学（第七版）',
        author: '同济大学数学系',
        publisher: '高等教育出版社',
        isbn: '9787040494958',
        price: 25,
        originalPrice: 45,
        image: '/images/book1.jpg'
      },
      {
        id: 2,
        title: '线性代数（第六版）',
        author: '同济大学数学系',
        publisher: '高等教育出版社',
        isbn: '9787040494959',
        price: 20,
        originalPrice: 38,
        image: '/images/book2.jpg'
      }
    ];

    setTimeout(() => {
      this.setData({
        booksList: mockData,
        loading: false
      });
      wx.stopPullDownRefresh();
    }, 1000);
  },

  // 加载论坛数据
  loadForumData() {
    // 模拟数据
    const mockData = [
      {
        id: 1,
        username: '王五',
        avatar: '/images/avatar3.png',
        time: '1小时前',
        title: '关于食堂饭菜的讨论',
        content: '大家觉得新食堂怎么样？有什么推荐的菜品吗？',
        location: '湖州学院',
        images: ['/images/food1.jpg', '/images/food2.jpg'],
        likes: 25,
        comments: 12,
        collects: 8
      },
      {
        id: 2,
        username: '赵六',
        avatar: '/images/avatar4.png',
        time: '3小时前',
        title: '图书馆学习氛围如何？',
        content: '最近在图书馆学习，感觉氛围很不错，大家有什么学习心得分享吗？',
        location: '湖州学院图书馆',
        images: [],
        likes: 18,
        comments: 8,
        collects: 5
      }
    ];

    setTimeout(() => {
      this.setData({
        forumList: mockData,
        loading: false
      });
      wx.stopPullDownRefresh();
    }, 1000);
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

  // 查看拼车详情
  viewCarpoolDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/carpool/list/list?id=${item.id}`
    });
  },

  // 查看书籍详情
  viewBookDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/books/list/list?id=${item.id}`
    });
  },

  // 查看论坛详情
  viewForumDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/forum/list/list?id=${item.id}`
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

  // 收藏书籍
  collectBook(e) {
    const id = e.currentTarget.dataset.id;
    // 这里应该调用API
    wx.showToast({
      title: '收藏成功',
      icon: 'success'
    });
  },

  // 分享书籍
  shareBook(e) {
    const item = e.currentTarget.dataset.item;
    wx.showShareMenu({
      withShareTicket: true
    });
  },

  // 点赞帖子
  likePost(e) {
    const id = e.currentTarget.dataset.id;
    // 这里应该调用API
    wx.showToast({
      title: '点赞成功',
      icon: 'success'
    });
  },

  // 评论帖子
  commentPost(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/forum/list/list?id=${id}&tab=comments`
    });
  },

  // 收藏帖子
  collectPost(e) {
    const id = e.currentTarget.dataset.id;
    // 这里应该调用API
    wx.showToast({
      title: '收藏成功',
      icon: 'success'
    });
  },

  // 分享帖子
  sharePost(e) {
    const item = e.currentTarget.dataset.item;
    wx.showShareMenu({
      withShareTicket: true
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
      path: '/pages/forum/forum',
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