// pages/books/list/list.js
Page({
  data: {
    booksList: [],
    searchKeyword: '',
    currentFilter: 'all',
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10
  },

  onLoad(options) {
    // this.loadBooksList();
    this.getlist();
    this.setData({
      booksList:wx.getStorageSync('booklist')
    })
    console.log(this.data.bookList)
  },

  onShow() {
    // 页面显示时刷新数据
    // this.loadBooksList();
    this.getlist();
  },

  onPullDownRefresh() {
    this.setData({
      page: 1,
      hasMore: true,
      booksList: []
    });
    this.getlist();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore();
    }
  },

  // 加载书籍列表

  getlist(){
      const { page, size } = this.data;
      wx.request({
        url: 'http://localhost:8081/api/book/list', // 后端接口地址
        method: 'GET', // 与后端 @GetMapping 对应
        data: {        // 传递的参数（会自动拼接到 URL 上）
          page: page,
          size: 10
        },
        success: (res) => {
          console.log(res.data.data.records)
          // 假设后端返回的 Result 结构为 { code: 200, data: { records: [], total: ... } }
          if (res.data.code === 200) {
            this.setData({
              bookList: res.data.data.records, // 存储当前页数据
              total: res.data.data.length       // 存储总条数
            });
            wx.setStorageSync('booklist', res.data.data.records)
          } else {
            wx.showToast({
              title: '获取数据失败',
              icon: 'none'
            });
          }
        },
        fail: (err) => {
          console.error('请求失败', err);
          wx.showToast({
            title: '网络错误',
            icon: 'none'
          });
        }
      });
  },

  // 搜索输入
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },

  // 搜索
  search() {
    if (!this.data.searchKeyword.trim()) {
      wx.showToast({
        title: '请输入搜索关键词',
        icon: 'none'
      });
      return;
    }
    
    wx.showToast({
      title: '搜索功能开发中',
      icon: 'none'
    });
  },

  // 设置筛选
  setFilter(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({
      currentFilter: filter,
      page: 1,
      hasMore: true,
      booksList: []
    });
    this.getlist();
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
      const newData = [
        {
          id: this.data.booksList.length + 1,
          title: '概率论与数理统计',
          author: '盛骤',
          publisher: '高等教育出版社',
          price: 28,
          major: '数学类',
          condition: '九成新',
          description: '无笔记，保存完好',
          cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80',
          sellerName: '赵同学',
          sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
          publishTime: '1天前',
          likes: 10,
          collects: 6
        }
      ];

      this.setData({
        booksList: [...this.data.booksList, ...newData],
        loading: false,
        hasMore: this.data.page < 3 // 模拟只有3页数据
      });
    }, 1000);
  },

  // 查看详情
  viewDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: `/pages/books/detail/detail?id=${item.id}`
    });
    
  },

  // 点赞书籍
  likeBook(e) {
    const id = e.currentTarget.dataset.id;
    const booksList = this.data.booksList.map(item => {
      if (item.id === id) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    });
    
    this.setData({ booksList });
    wx.showToast({
      title: '点赞成功',
      icon: 'success'
    });
  },

  // 收藏书籍
  collectBook(e) {
    const id = e.currentTarget.dataset.id;
    const booksList = this.data.booksList.map(item => {
      if (item.id === id) {
        return { ...item, collects: item.collects + 1 };
      }
      return item;
    });
    
    this.setData({ booksList });
    wx.showToast({
      title: '收藏成功',
      icon: 'success'
    });
  },

  // 联系卖家
  contactSeller(e) {
    const item = e.currentTarget.dataset.item;
    wx.showModal({
      title: '联系卖家',
      content: `是否联系 ${item.sellerName}？`,
      confirmText: '联系',
      success: (res) => {
        if (res.confirm) {
          // 这里可以跳转到聊天页面或拨打电话
          wx.showToast({
            title: '联系功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  // 分享给朋友
  onShareAppMessage() {
    return {
      title: '校园二手书交易平台',
      path: '/pages/books/list/list',
      imageUrl: '/images/share-books.png'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '校园二手书交易平台',
      imageUrl: '/images/share-books.png'
    };
  },

  // 跳转到卖书发布页
  goToPublish() {
    wx.navigateTo({
      url: '/pages/books/publish/publish'
    });
  },

  // 显示搜索
  showSearch() {
    wx.showToast({
      title: '搜索功能开发中',
      icon: 'none'
    });
  }
});