// pages/else/sale/sale.js
Page({
  data: {
    item: null,
    isLiked: false,
    isCollected: false,
    currentImageIndex: 0,
    images: []
  },

  onLoad(options) {
    // 从页面参数或本地存储获取商品信息
    if (options.itemData) {
      try {
        const itemData = JSON.parse(decodeURIComponent(options.itemData));
        this.setData({
          item: itemData,
          images: itemData.images ? (Array.isArray(itemData.images) ? itemData.images : [itemData.images]) : []
        });
      } catch (e) {
        console.error('解析商品数据失败:', e);
        this.loadMockData();
      }
    } else if (options.id) {
      this.loadItemById(options.id);
    } else {
      this.loadMockData();
    }
  },

  // 根据ID加载商品（从本地存储查找）
  loadItemById(id) {
    const allItems = wx.getStorageSync('itemlist') || [];
    const item = allItems.find(item => item.id == id);
    if (item) {
      this.setData({
        item: item,
        images: item.images ? (Array.isArray(item.images) ? item.images : [item.images]) : []
      });
    } else {
      this.loadMockData();
    }
  },

  // 加载模拟数据
  loadMockData() {
    const mockItem = {
      id: 1,
      title: '二手自行车',
      category: '闲置物品',
      price: 200,
      originalPrice: 500,
      condition: '八成新',
      description: '骑行顺畅，刹车灵敏，轮胎状况良好，适合校园代步。',
      images: [
        'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?auto=format&fit=crop&w=400&q=80',
        'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80'
      ],
      sellerName: '李同学',
      sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      publishTime: '1天前',
      likes: 8,
      collects: 4,
      location: '湖州学院',
      phone: '138****8888',
      wechat: 'student_lee'
    };
    this.setData({
      item: mockItem,
      images: mockItem.images
    });
  },

  // 切换图片
  switchImage(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ currentImageIndex: index });
  },

  // 点赞功能
  likeItem() {
    const item = this.data.item;
    const isLiked = this.data.isLiked;
    
    this.setData({
      isLiked: !isLiked,
      'item.likes': isLiked ? item.likes - 1 : item.likes + 1
    });

    // 更新本地存储中的数据
    this.updateLocalStorage();

    wx.showToast({
      title: isLiked ? '取消点赞' : '点赞成功',
      icon: 'success'
    });
  },

  // 收藏功能
  collectItem() {
    const item = this.data.item;
    const isCollected = this.data.isCollected;
    
    this.setData({
      isCollected: !isCollected,
      'item.collects': isCollected ? item.collects - 1 : item.collects + 1
    });

    // 更新本地存储中的数据
    this.updateLocalStorage();

    wx.showToast({
      title: isCollected ? '取消收藏' : '收藏成功',
      icon: 'success'
    });
  },

  // 购买功能
  purchaseItem() {
    wx.showModal({
      title: '购买功能',
      content: '该功能尚未开发，敬请期待！',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 联系卖家
  contactSeller() {
    const item = this.data.item;
    wx.showModal({
      title: '联系卖家',
      content: `是否联系 ${item.sellerName}？\n手机：${item.phone}\n微信：${item.wechat}`,
      confirmText: '联系',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '联系功能开发中',
            icon: 'none'
          });
        }
      }
    });
  },

  // 更新本地存储中的数据
  updateLocalStorage() {
    const allItems = wx.getStorageSync('itemlist') || [];
    const updatedItems = allItems.map(item => {
      if (item.id === this.data.item.id) {
        return this.data.item;
      }
      return item;
    });
    wx.setStorageSync('itemlist', updatedItems);
  },

  // 分享功能
  onShareAppMessage() {
    const item = this.data.item;
    return {
      title: `推荐商品：${item.title}`,
      path: `/pages/else/sale/sale?id=${item.id}`,
      imageUrl: item.images && item.images[0] ? item.images[0] : ''
    };
  }
})