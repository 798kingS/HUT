// pages/else/list/list.js
Page({
  data: {
    itemsList: [],
    searchKeyword: '',
    currentFilter: 'all',
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10,
    searchTimer: null
  },

  onLoad(options) {
    // this.loadItemsList();
    this.getlist();
    this.setData({
      itemsList: wx.getStorageSync('itemlist')
    })
    console.log(this.data.itemsList)
  },

  onShow() {
    // 页面显示时刷新数据
    // this.loadItemsList();
    this.getlist();
  },

  onPullDownRefresh() {
    this.setData({
      page: 1,
      hasMore: true,
      itemsList: []
    });
    this.getlist();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore();
    }
  },

  // 加载闲置物品列表

  getlist() {
    // 本地模拟加载：从缓存读取，如无则生成一批默认数据
    const localStored = wx.getStorageSync('itemlist') || [];
    if (localStored.length > 0) {
      this.setData({ itemsList: localStored, total: localStored.length });
      return;
    }

    const sampleTitles = ['二手自行车', '九成新电吹风', '闲置台灯', '移动硬盘1TB', '蓝牙耳机', '保温杯', '篮球', '课本资料打包', '收纳盒', '小米路由器'];
    const sampleImages = [
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1518443895914-1f1d4c9c38e0?auto=format&fit=crop&w=300&q=80'
    ];
    const conditions = ['全新', '九成新', '八成新', '七成新'];
    const base = Date.now();
    const defaults = Array.from({ length: 20 }).map((_, i) => ({
      id: base + i,
      title: sampleTitles[i % sampleTitles.length],
      category: '闲置物品',
      price: Math.floor(20 + Math.random() * 300),
      condition: conditions[i % conditions.length],
      description: '商品成色良好，功能正常，可当面验货。',
      images: sampleImages[i % sampleImages.length],
      sellerName: '校园同学',
      sellerAvatar: '/images/卖家头像.png',
      publishTime: '今天',
      likes: Math.floor(Math.random() * 50),
      collects: Math.floor(Math.random() * 30)
    }));
    wx.setStorageSync('itemlist', defaults);
    this.setData({ itemsList: defaults, total: defaults.length });
  },

  // 搜索输入
  onSearchInput(e) {
    const keyword = (e.detail.value || '').trim();
    this.setData({ searchKeyword: keyword });
    // 简单防抖
    if (this.data.searchTimer) clearTimeout(this.data.searchTimer);
    const timer = setTimeout(() => {
      this.applyFilters();
    }, 200);
    this.setData({ searchTimer: timer });
  },

  // 搜索
  search() {
    if (!this.data.searchKeyword.trim()) {
      this.applyFilters();
      return;
    }
    this.applyFilters(true);
  },

  // 设置筛选
  setFilter(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({
      currentFilter: filter,
      page: 1,
      hasMore: true,
      itemsList: []
    });
    this.applyFilters();
  },

  // 加载更多
  loadMore() {
    if (this.data.loading || !this.data.hasMore) return;
    
    this.setData({
      loading: true,
      page: this.data.page + 1
    });

    // 模拟加载更多数据（批量10条）
    setTimeout(() => {
      const baseIndex = this.data.itemsList.length;
      const sampleTitles = ['二手自行车', '九成新电吹风', '闲置台灯', '移动硬盘1TB', '蓝牙耳机', '保温杯', '篮球', '课本资料打包', '收纳盒', '小米路由器'];
      const sampleImages = [
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80',
        'https://images.unsplash.com/photo-1518443895914-1f1d4c9c38e0?auto=format&fit=crop&w=300&q=80'
      ];
      const conditions = ['全新', '九成新', '八成新', '七成新'];
      const newBatch = Array.from({ length: 1 }).map((_, i) => {
        const idx = (baseIndex + i) % sampleTitles.length;
        return {
          id: baseIndex + i + 1,
          title: sampleTitles[idx],
          category: '闲置物品',
          price: Math.floor(20 + Math.random() * 300),
          condition: conditions[(baseIndex + i) % conditions.length],
          description: '商品成色良好，功能正常，可当面验货。',
          images: sampleImages[(baseIndex + i) % sampleImages.length],
          sellerName: '校园同学',
          sellerAvatar: '/images/卖家头像.png',
          publishTime: '刚刚',
          likes: Math.floor(Math.random() * 50),
          collects: Math.floor(Math.random() * 30)
        };
      });

      this.setData({
        itemsList: [...this.data.itemsList, ...newBatch],
        loading: false,
        hasMore: this.data.page < 5 // 模拟5页数据更充足
      });
    }, 600);
  },

  // 本地过滤（关键字 + 筛选）
  applyFilters(showToastIfEmpty = false) {
    const keyword = (this.data.searchKeyword || '').toLowerCase();
    const filter = this.data.currentFilter;
    const allItems = wx.getStorageSync('itemlist') || [];

    const matchesKeyword = (item) => {
      if (!keyword) return true;
      const fields = [item.title, item.description, item.category, item.condition]
        .filter(Boolean)
        .map(v => String(v).toLowerCase());
      return fields.some(text => text.includes(keyword));
    };

    const matchesFilter = (item) => {
      if (!filter || filter === 'all') return true;
      // 同时支持按品类或成色做简单过滤
      return item.category === filter || item.condition === filter || String(item.title || '').includes(filter);
    };

    const filtered = allItems.filter(item => matchesKeyword(item) && matchesFilter(item));
    this.setData({ itemsList: filtered, total: filtered.length });
    if (showToastIfEmpty && filtered.length === 0) {
      wx.showToast({ title: '未找到匹配结果', icon: 'none' });
    }
  },

  // 查看详情
  viewDetail(e) {
    const item = e.currentTarget.dataset.item;
    // 将商品数据编码后传递到sale页面
    const itemData = encodeURIComponent(JSON.stringify(item));
    wx.navigateTo({
      url: `/pages/else/sale/sale?itemData=${itemData}`
    });
  },

  // 点赞物品
  likeItem(e) {
    const id = e.currentTarget.dataset.id;
    const itemsList = this.data.itemsList.map(item => {
      if (item.id === id) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    });
    
    this.setData({ itemsList });
    wx.showToast({
      title: '点赞成功',
      icon: 'success'
    });
  },

  // 收藏物品
  collectItem(e) {
    const id = e.currentTarget.dataset.id;
    const itemsList = this.data.itemsList.map(item => {
      if (item.id === id) {
        return { ...item, collects: item.collects + 1 };
      }
      return item;
    });
    
    this.setData({ itemsList });
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
      title: '校园闲置物品交易平台',
      path: '/pages/else/list/list',
      imageUrl: '/images/share-items.png'
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '校园闲置物品交易平台',
      imageUrl: '/images/share-items.png'
    };
  },

  // 跳转到物品发布页
  goToPublish() {
    wx.navigateTo({
      url: '/pages/else/publish/publish'
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