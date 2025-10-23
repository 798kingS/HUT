// pages/food/list/list.js
Page({
  data: {
    ordersList: [],
    searchKeyword: '',
    currentFilter: 'all',
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10,
    searchTimer: null,
    searchFocus: false,
    quickText: ''
  },

  onLoad(options) {
    this.getOrdersList();
  },

  onShow() {
    // 页面显示时刷新数据
    this.getOrdersList();
  },

  onPullDownRefresh() {
    this.setData({
      page: 1,
      hasMore: true,
      ordersList: []
    });
    this.getOrdersList();
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore();
    }
  },

  // 加载外卖订单列表
  getOrdersList() {
    // 本地模拟加载：从缓存读取，如无则生成一批默认数据
    const localStored = wx.getStorageSync('foodOrders') || [];
    if (localStored.length > 0) {
      this.setData({ ordersList: localStored, total: localStored.length });
      return;
    }

    const sampleRestaurants = ['麦当劳', '肯德基', '必胜客', '星巴克', '瑞幸咖啡', '喜茶', '奈雪的茶', '海底捞', '小龙坎', '黄焖鸡米饭'];
    const sampleFoods = ['汉堡套餐', '炸鸡桶', '披萨', '咖啡', '奶茶', '火锅', '麻辣烫', '黄焖鸡', '盖浇饭', '面条'];
    const sampleAddresses = ['湖州学院宿舍区', '湖州学院教学楼', '湖州学院图书馆', '湖州学院食堂', '湖州学院体育馆'];
    const base = Date.now();
    const defaults = Array.from({ length: 20 }).map((_, i) => {
      const statuses = ['待接单', '已接单', '配送中', '已完成'];
      const statusClasses = ['pending', 'accepted', 'delivering', 'completed'];
      const statusIndex = Math.floor(Math.random() * 4);
      return {
        id: base + i,
        restaurant: sampleRestaurants[i % sampleRestaurants.length],
        foodName: sampleFoods[i % sampleFoods.length],
        price: Math.floor(15 + Math.random() * 50),
        deliveryFee: Math.floor(2 + Math.random() * 8),
        totalPrice: 0,
        status: statuses[statusIndex],
        statusClass: statusClasses[statusIndex],
        orderTime: '今天',
        deliveryAddress: sampleAddresses[i % sampleAddresses.length],
        customerName: '同学' + (i + 1),
        customerAvatar: '/images/卖家头像.png',
        phone: '138****' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
        description: '请尽快送达，谢谢！',
        estimatedTime: Math.floor(20 + Math.random() * 40) + '分钟',
        commission: Math.floor(3 + Math.random() * 8), // 佣金3-10元
        location: '东区'
      };
    });

    // 计算总价
    defaults.forEach(item => {
      item.totalPrice = item.price + item.deliveryFee;
    });

    wx.setStorageSync('foodOrders', defaults);
    this.setData({ ordersList: defaults, total: defaults.length });
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
      ordersList: []
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

    // 模拟加载更多数据（批量5条）
    setTimeout(() => {
      const baseIndex = this.data.ordersList.length;
      const sampleRestaurants = ['麦当劳', '肯德基', '必胜客', '星巴克', '瑞幸咖啡', '喜茶', '奈雪的茶', '海底捞', '小龙坎', '黄焖鸡米饭'];
      const sampleFoods = ['汉堡套餐', '炸鸡桶', '披萨', '咖啡', '奶茶', '火锅', '麻辣烫', '黄焖鸡', '盖浇饭', '面条'];
      const sampleAddresses = ['湖州学院宿舍区', '湖州学院教学楼', '湖州学院图书馆', '湖州学院食堂', '湖州学院体育馆'];
      const newBatch = Array.from({ length: 5 }).map((_, i) => {
        const idx = (baseIndex + i) % sampleRestaurants.length;
        const price = Math.floor(15 + Math.random() * 50);
        const deliveryFee = Math.floor(2 + Math.random() * 8);
        const statuses = ['待接单', '已接单', '配送中', '已完成'];
        const statusClasses = ['pending', 'accepted', 'delivering', 'completed'];
        const statusIndex = Math.floor(Math.random() * 4);
        return {
          id: baseIndex + i + 1,
          restaurant: sampleRestaurants[idx],
          foodName: sampleFoods[idx],
          price: price,
          deliveryFee: deliveryFee,
          totalPrice: price + deliveryFee,
          status: statuses[statusIndex],
          statusClass: statusClasses[statusIndex],
          orderTime: '刚刚',
          deliveryAddress: sampleAddresses[idx % sampleAddresses.length],
          customerName: '同学' + (baseIndex + i + 1),
          customerAvatar: '/images/卖家头像.png',
          phone: '138****' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
          description: '请尽快送达，谢谢！',
          estimatedTime: Math.floor(20 + Math.random() * 40) + '分钟',
          commission: Math.floor(3 + Math.random() * 8), // 佣金3-10元
          location: '东区'
        };
      });

      this.setData({
        ordersList: [...this.data.ordersList, ...newBatch],
        loading: false,
        hasMore: this.data.page < 5 // 模拟5页数据
      });
    }, 600);
  },

  // 本地过滤（关键字 + 筛选）
  applyFilters(showToastIfEmpty = false) {
    const keyword = (this.data.searchKeyword || '').toLowerCase();
    const filter = this.data.currentFilter;
    const allOrders = wx.getStorageSync('foodOrders') || [];

    const matchesKeyword = (order) => {
      if (!keyword) return true;
      const fields = [order.restaurant, order.foodName, order.deliveryAddress, order.customerName, order.description]
        .filter(Boolean)
        .map(v => String(v).toLowerCase());
      return fields.some(text => text.includes(keyword));
    };

    const matchesFilter = (order) => {
      if (!filter || filter === 'all') return true;
      if (filter === '待接单') return order.status === '待接单';
      if (filter === 'myPosts') return order.customerName.includes('我发布的'); // 模拟我发布的订单
      if (filter === 'myHelp') return order.status === '已完成'; // 模拟我帮助的订单
      return order.status === filter || order.restaurant === filter;
    };

    const filtered = allOrders.filter(order => matchesKeyword(order) && matchesFilter(order));
    this.setData({ ordersList: filtered, total: filtered.length });
    if (showToastIfEmpty && filtered.length === 0) {
      wx.showToast({ title: '未找到匹配结果', icon: 'none' });
    }
  },

  // 阻止事件冒泡
  stopPropagation() {},

  // 搜索焦点管理
  onSearchFocus() {
    this.setData({ searchFocus: true });
  },

  onSearchBlur() {
    this.setData({ searchFocus: false });
  },

// 快速发布输入（增强同步逻辑）
onQuickInput(e) {
  const value = e.detail.value || '';
  this.setData({ 
    quickText: value ,
    // 新增一个状态用于显式控制按钮禁用（避免trim()在wxml中计算延迟）
    isPublishDisabled: !value.trim()
  }, () => {
    // 回调函数：确认状态已更新
    console.log('输入同步完成，是否禁用：', this.data.isPublishDisabled);
  });
  // 调试用：确认输入是否正确同步（可删除）
  // console.log('当前输入:', this.data.quickText);
},

// 快速发布（加强校验）
quickPublish() {
  console.log('发布按钮被点击了！当前输入内容：', this.data.quickText);
  const text = this.data.quickText.trim();
  // 双重校验：即使按钮被意外启用，也拦截空内容
  if (!text) {
    wx.showToast({
      title: '请输入有效内容（不能全是空格哦）',
      icon: 'none',
      duration: 2000
    });
    return;
  }

  // 以下为原发布逻辑（不变）
  const commissionMatch = text.match(/佣金(\d+)/);
  const commission = commissionMatch ? parseInt(commissionMatch[1]) : 0;

  const newOrder = {
    id: Date.now(),
    restaurant: '用户发布',
    foodName: '外卖',
    price: 0,
    deliveryFee: 0,
    totalPrice: 0,
    status: '待接单',
    statusClass: 'pending',
    orderTime: '刚刚',
    deliveryAddress: '湖州学院',
    customerName: '我发布的',
    customerAvatar: '/images/卖家头像.png',
    phone: '138****8888',
    description: text,
    estimatedTime: '30分钟',
    commission: commission,
    location: '东区',
    restaurantImage: '/images/餐厅.png'
  };

  const ordersList = [newOrder, ...this.data.ordersList];
  this.setData({ ordersList, quickText: '' });

  const allOrders = wx.getStorageSync('foodOrders') || [];
  allOrders.unshift(newOrder);
  wx.setStorageSync('foodOrders', allOrders);

  wx.showToast({
    title: '发布成功！',
    icon: 'success'
  });
},

  // 不再进行复杂解析

  // // 查看订单详情
  // viewOrderDetail(e) {
  //   const order = e.currentTarget.dataset.order;
  //   // 将订单数据编码后传递到详情页面
  //   const orderData = encodeURIComponent(JSON.stringify(order));
  //   wx.navigateTo({
  //     url: `/pages/food/detail/detail?orderData=${orderData}`
  //   });
  // },

  // // 接单功能
  // takeOrder(e) {
  //   const orderId = e.currentTarget.dataset.id;
  //   const ordersList = this.data.ordersList.map(order => {
  //     if (order.id === orderId) {
  //       return { ...order, status: '已接单', statusClass: 'accepted' };
  //     }
  //     return order;
  //   });
    
    // this.setData({ ordersList });
    
    // 更新本地存储

  // 取餐功能
  pickupOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    const order = this.data.ordersList.find(item => item.id === orderId);
    
    if (!order) return;
    
    wx.showModal({
      title: '确认取餐',
      content: `确认已取到 ${order.restaurant} 的 ${order.foodName} 吗？\n完成后将获得佣金 ¥${order.commission}`,
      confirmText: '确认取餐',
      success: (res) => {
        if (res.confirm) {
          // 更新订单状态为配送中
          const ordersList = this.data.ordersList.map(item => {
            if (item.id === orderId) {
              return { ...item, status: '配送中', statusClass: 'delivering' };
            }
            return item;
          });
          
          this.setData({ ordersList });
          
          // 更新本地存储
          const allOrders = wx.getStorageSync('foodOrders') || [];
          const updatedOrders = allOrders.map(item => {
            if (item.id === orderId) {
              return { ...item, status: '配送中', statusClass: 'delivering' };
            }
            return item;
          });
          wx.setStorageSync('foodOrders', updatedOrders);

          wx.showToast({
            title: '取餐成功，开始配送',
            icon: 'success'
          });
        }
      }
    });
  },

  // 点赞订单
  likeOrder(e) {
    const id = e.currentTarget.dataset.id;
    const ordersList = this.data.ordersList.map(order => {
      if (order.id === id) {
        const newLiked = !order.isLiked;
        return { 
          ...order, 
          isLiked: newLiked,
          likes: newLiked ? order.likes + 1 : Math.max(0, order.likes - 1)
        };
      }
      return order;
    });
    
    this.setData({ ordersList });
    
    // 更新本地存储
    const allOrders = wx.getStorageSync('foodOrders') || [];
    const updatedOrders = allOrders.map(order => {
      if (order.id === id) {
        const newLiked = !order.isLiked;
        return { 
          ...order, 
          isLiked: newLiked,
          likes: newLiked ? order.likes + 1 : Math.max(0, order.likes - 1)
        };
      }
      return order;
    });
    wx.setStorageSync('foodOrders', updatedOrders);

    const order = ordersList.find(item => item.id === id);
    wx.showToast({
      title: order.isLiked ? '点赞成功' : '取消点赞',
      icon: 'success'
    });
  },

  // 收藏订单
  collectOrder(e) {
    const id = e.currentTarget.dataset.id;
    const ordersList = this.data.ordersList.map(order => {
      if (order.id === id) {
        const newCollected = !order.isCollected;
        return { 
          ...order, 
          isCollected: newCollected,
          collects: newCollected ? order.collects + 1 : Math.max(0, order.collects - 1)
        };
      }
      return order;
    });
    
    this.setData({ ordersList });
    
    // 更新本地存储
    const allOrders = wx.getStorageSync('foodOrders') || [];
    const updatedOrders = allOrders.map(order => {
      if (order.id === id) {
        const newCollected = !order.isCollected;
        return { 
          ...order, 
          isCollected: newCollected,
          collects: newCollected ? order.collects + 1 : Math.max(0, order.collects - 1)
        };
      }
      return order;
    });
    wx.setStorageSync('foodOrders', updatedOrders);

    const order = ordersList.find(item => item.id === id);
    wx.showToast({
      title: order.isCollected ? '收藏成功' : '取消收藏',
      icon: 'success'
    });
  },

  // 联系下单者
  contactCustomer(e) {
    const order = e.currentTarget.dataset.order;
    wx.showModal({
      title: '联系下单者',
      content: `是否联系 ${order.customerName}？\n手机：${order.phone}`,
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

  // 显示删除确认弹窗
  showDeleteConfirm(e) {
    const orderId = e.currentTarget.dataset.id;
    const order = this.data.ordersList.find(item => item.id === orderId);
    
    if (!order) return;

    wx.showModal({
      title: '确认删除',
      content: `确定要删除【${order.restaurant} - ${order.foodName}】吗？`,
      confirmText: '删除',
      cancelText: '取消',
      confirmColor: '#f33', // 确认按钮红色，增强警示
      success: (res) => {
        if (res.confirm) {
          this.deleteOrder(orderId); // 确认后执行删除
        }
      }
    });
  },

  // 执行删除订单逻辑
  deleteOrder(orderId) {
    // 1. 过滤掉要删除的订单（更新页面列表）
    const filteredOrders = this.data.ordersList.filter(item => item.id !== orderId);
    this.setData({
      ordersList: filteredOrders
    });

    // 2. 更新本地存储（同步删除）
    const allOrders = wx.getStorageSync('foodOrders') || [];
    const updatedStorage = allOrders.filter(item => item.id !== orderId);
    wx.setStorageSync('foodOrders', updatedStorage);

    // 3. 提示删除成功
    wx.showToast({
      title: '删除成功',
      icon: 'success',
      duration: 1500
    });
  },
  
  // 跳转到发布需求页
  goToPublish() {
    wx.navigateTo({
      url: '/pages/food/publish/publish'
    });
  },

  // 分享功能
  onShareAppMessage() {
    return {
      title: '校园外卖接单平台',
      path: '/pages/food/list/list',
      imageUrl: '/images/share-food.png'
    };
  },

  onShareTimeline() {
    return {
      title: '校园外卖接单平台',
      imageUrl: '/images/share-food.png'
    };
  }
});
