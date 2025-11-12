// pages/word/word.js
const app = getApp();

Page({
  data: {
    messagesList: [],
    currentFilter: 'all',
    loading: false,
    hasLogin: false,
    userInfo: null,
    hasShownLoginTip: false
  },

  onLoad(options) {
    this.checkLoginStatus(true);
    this.loadMessages();
  },

  onShow() {
    // 页面显示时刷新数据
    this.checkLoginStatus(false);
    this.loadMessages();
  },

  onPullDownRefresh() {
    this.loadMessages();
  },

  // 检查登录状态
  checkLoginStatus(showTip = false) {
    const hasLogin = app.globalData.hasLogin;
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    
    this.setData({
      hasLogin: hasLogin,
      userInfo: userInfo
    });
    
    // 如果未登录且需要提示，且还未提示过，则提示用户
    if (!hasLogin && showTip && !this.data.hasShownLoginTip) {
      this.setData({ hasShownLoginTip: true });
      // 不弹出提示，直接显示空状态更友好
    }
  },

  // 加载消息列表
  loadMessages() {
    this.setData({ loading: true });
    
    // 获取用户信息
    const userInfo = this.data.userInfo || app.globalData.userInfo || wx.getStorageSync('userInfo');
    const userNickName = userInfo ? (userInfo.nickName || userInfo.nickname || '') : '';
    
    // 如果未登录，显示空状态
    if (!this.data.hasLogin || !userInfo) {
      this.setData({
        messagesList: [],
        loading: false
      });
      wx.stopPullDownRefresh();
      return;
    }
    
    // 从本地存储获取各类消息（使用正确的存储键）
    const carpoolList = wx.getStorageSync('carpoolList') || [];
    const foodMessages = wx.getStorageSync('foodOrders') || [];
    const bookList = wx.getStorageSync('booklist') || [];
    const itemList = wx.getStorageSync('itemlist') || [];
    
    // 过滤并转换拼车消息（只显示用户自己的）
    const carpoolMessages = carpoolList
      .filter(item => {
        // 用户发布的拼车（username匹配）或用户参与的拼车（如果有participants字段）
        return item.username === userNickName || 
               (item.participants && item.participants.includes(userNickName)) ||
               (item.userId && item.userId === userInfo.userId);
      })
      .map(item => ({
        id: item.id || Date.now() + Math.random(),
        type: '拼车',
        title: `拼车：${item.departure || '湖州学院'} → ${item.destination || '目的地'}`,
        description: `出发时间：${item.departureTime || '待定'}`,
        avatar: item.avatar || '/images/头像.png',
        time: item.time || '刚刚',
        departure: item.departure,
        destination: item.destination,
        price: item.price,
        status: item.status || '待确认',
        statusClass: this.getStatusClass(item.status || '待确认'),
        progress: this.getProgress(item.status || '待确认'),
        isMyPost: item.username === userNickName || (item.userId && item.userId === userInfo.userId)
      }));
    
    // 过滤并转换外卖消息（只显示用户自己的）
    const foodList = foodMessages
      .filter(item => {
        // 用户发布的外卖：customerName === '我发布的' 或 customerName === 用户昵称
        const isMyPost = item.customerName === '我发布的' ||
                        item.customerName === userNickName ||
                        (item.userId && item.userId === userInfo.userId);
        
        // 用户接单的外卖：如果有deliveryPerson字段且等于用户昵称
        // 或者状态不是'待接单'且deliveryPerson等于用户昵称
        const isMyOrder = item.deliveryPerson === userNickName ||
                         (item.deliveryPersonId && item.deliveryPersonId === userInfo.userId);
        
        return isMyPost || isMyOrder;
      })
      .map(item => {
        const isMyPost = item.customerName === '我发布的' || 
                        item.customerName === userNickName ||
                        (item.userId && item.userId === userInfo.userId);
        const isMyOrder = !isMyPost && (item.deliveryPerson === userNickName ||
                                       (item.deliveryPersonId && item.deliveryPersonId === userInfo.userId));
        return {
          id: item.id || Date.now() + Math.random(),
          type: '外卖',
          title: isMyPost ? `我发布的外卖：${item.restaurant || '餐厅'} - ${item.foodName || '菜品'}` :
                `我接单的外卖：${item.restaurant || '餐厅'} - ${item.foodName || '菜品'}`,
          description: item.description || '外卖配送',
          avatar: item.customerAvatar || '/images/头像.png',
          time: item.orderTime || '刚刚',
          restaurant: item.restaurant,
          foodName: item.foodName,
          price: item.commission || item.totalPrice,
          status: item.status || '待接单',
          statusClass: this.getStatusClass(item.status || '待接单'),
          progress: this.getProgress(item.status || '待接单'),
          isMyPost: isMyPost,
          isMyOrder: isMyOrder
        };
      });
    
    // 过滤并转换出售消息（书籍）- 只显示用户自己的
    const bookMessages = bookList
      .filter(item => {
        // 用户出售的书籍（sellerName匹配）或用户购买的书籍（如果有buyer字段）
        return item.sellerName === userNickName ||
               (item.buyer && item.buyer === userNickName) ||
               (item.userId && item.userId === userInfo.userId) ||
               (item.buyerId && item.buyerId === userInfo.userId);
      })
      .map(item => {
        const isMyPost = item.sellerName === userNickName || 
                        (item.userId && item.userId === userInfo.userId);
        const isMyPurchase = !isMyPost && (item.buyer === userNickName || 
                                          (item.buyerId && item.buyerId === userInfo.userId));
        return {
          id: item.id || Date.now() + Math.random(),
          type: '出售',
          title: isMyPost ? `我出售的书籍：${item.title || item.bookName || '书籍'}` :
                `我购买的书籍：${item.title || item.bookName || '书籍'}`,
          description: item.description || item.content || '二手书籍',
          avatar: item.avatar || item.sellerAvatar || '/images/头像.png',
          time: item.publishTime || item.time || '刚刚',
          bookName: item.title || item.bookName,
          price: item.price,
          status: item.status || '待接单',
          statusClass: this.getStatusClass(item.status || '待接单'),
          progress: this.getProgress(item.status || '待接单'),
          isMyPost: isMyPost,
          isMyPurchase: isMyPurchase
        };
      });
    
    // 过滤并转换出售消息（闲置物品）- 只显示用户自己的
    const elseMessages = itemList
      .filter(item => {
        // 用户出售的闲置物品（sellerName匹配）或用户购买的闲置物品（如果有buyer字段）
        return item.sellerName === userNickName ||
               (item.buyer && item.buyer === userNickName) ||
               (item.userId && item.userId === userInfo.userId) ||
               (item.buyerId && item.buyerId === userInfo.userId);
      })
      .map(item => {
        const isMyPost = item.sellerName === userNickName || 
                        (item.userId && item.userId === userInfo.userId);
        const isMyPurchase = !isMyPost && (item.buyer === userNickName || 
                                          (item.buyerId && item.buyerId === userInfo.userId));
        return {
          id: item.id || Date.now() + Math.random(),
          type: '出售',
          title: isMyPost ? `我出售的物品：${item.title || item.itemName || '闲置物品'}` :
                `我购买的物品：${item.title || item.itemName || '闲置物品'}`,
          description: item.description || '闲置物品',
          avatar: item.sellerAvatar || item.avatar || '/images/头像.png',
          time: item.publishTime || item.time || '刚刚',
          itemName: item.title || item.itemName,
          price: item.price,
          status: item.status || '待接单',
          statusClass: this.getStatusClass(item.status || '待接单'),
          progress: this.getProgress(item.status || '待接单'),
          isMyPost: isMyPost,
          isMyPurchase: isMyPurchase
        };
      });
    
    // 合并所有消息并排序
    let allMessages = [...carpoolMessages, ...foodList, ...bookMessages, ...elseMessages];
    
    // 按时间排序（最新的在前）
    allMessages.sort((a, b) => {
      const timeA = this.parseTime(a.time);
      const timeB = this.parseTime(b.time);
      return timeB - timeA;
    });
    
    // 应用筛选
    const filteredMessages = this.applyFilter(allMessages, this.data.currentFilter);
    
    setTimeout(() => {
      this.setData({
        messagesList: filteredMessages,
        loading: false
      });
      wx.stopPullDownRefresh();
    }, 500);
  },
  
  
  // 获取状态样式类
  getStatusClass(status) {
    const statusMap = {
      '待接单': 'pending',
      '待确认': 'pending',
      '已接单': 'accepted',
      '已确认': 'accepted',
      '配送中': 'delivering',
      '进行中': 'delivering',
      '已完成': 'completed'
    };
    return statusMap[status] || 'pending';
  },
  
  // 获取进度百分比
  getProgress(status) {
    const progressMap = {
      '待接单': 25,
      '待确认': 25,
      '已接单': 50,
      '已确认': 50,
      '配送中': 75,
      '进行中': 75,
      '已完成': 100
    };
    return progressMap[status] || 25;
  },
  
  // 解析时间
  parseTime(timeStr) {
    if (!timeStr) return Date.now();
    if (timeStr === '刚刚') return Date.now();
    const hourMatch = timeStr.match(/(\d+)小时前/);
    if (hourMatch) {
      return Date.now() - parseInt(hourMatch[1]) * 60 * 60 * 1000;
    }
    return Date.now();
  },
  
  // 设置筛选
  setFilter(e) {
    const filter = e.currentTarget.dataset.filter;
    this.setData({ currentFilter: filter });
    this.loadMessages();
  },
  
  // 应用筛选
  applyFilter(messages, filter) {
    if (filter === 'all') return messages;
    return messages.filter(msg => msg.type === filter);
  },
  
  // 查看消息详情
  viewMessageDetail(e) {
    const message = e.currentTarget.dataset.message;
    // 根据消息类型跳转到不同页面
    switch (message.type) {
      case '拼车':
        wx.navigateTo({
          url: `/pages/carpool/list/list?id=${message.id}`
        });
        break;
      case '外卖':
        wx.navigateTo({
          url: `/pages/food/list/list?id=${message.id}`
        });
        break;
      case '出售':
        // 根据是否有bookName判断是书籍还是闲置物品
        if (message.bookName) {
          wx.navigateTo({
            url: `/pages/books/list/list?id=${message.id}`
          });
        } else {
          wx.navigateTo({
            url: `/pages/else/list/list?id=${message.id}`
          });
        }
        break;
    }
  },
  
  // 处理消息
  handleMessage(e) {
    const id = e.currentTarget.dataset.id;
    const type = e.currentTarget.dataset.type;
    const message = this.data.messagesList.find(msg => msg.id === id);
    
    if (!message) return;
    
    switch (type) {
      case '外卖':
        wx.showModal({
          title: '确认接单',
          content: `确认接单：${message.restaurant} - ${message.foodName}？`,
          success: (res) => {
            if (res.confirm) {
              this.updateMessageStatus(id, '已接单');
              wx.showToast({
                title: '接单成功',
                icon: 'success'
              });
            }
          }
        });
        break;
      case '拼车':
        wx.showModal({
          title: '确认拼车',
          content: `确认拼车：${message.departure} → ${message.destination}？`,
          success: (res) => {
            if (res.confirm) {
              this.updateMessageStatus(id, '已确认');
              wx.showToast({
                title: '确认成功',
                icon: 'success'
              });
            }
          }
        });
        break;
      case '出售':
        wx.showModal({
          title: '联系卖家',
          content: `是否联系卖家咨询 ${message.bookName || message.itemName}？`,
          success: (res) => {
            if (res.confirm) {
              wx.showToast({
                title: '联系功能开发中',
                icon: 'none'
              });
            }
          }
        });
        break;
    }
  },
  
  // 更新消息状态
  updateMessageStatus(id, newStatus) {
    const messagesList = this.data.messagesList.map(msg => {
      if (msg.id === id) {
        return {
          ...msg,
          status: newStatus,
          statusClass: this.getStatusClass(newStatus),
          progress: this.getProgress(newStatus)
        };
      }
      return msg;
    });
    
    this.setData({ messagesList });
    
    // 更新本地存储
    // 这里可以根据消息类型更新对应的本地存储
  },
  
  // 阻止事件冒泡
  stopPropagation() {},
  
  // 去登录
  goToLogin() {
    wx.switchTab({
      url: '/pages/profile/profile'
    });
  },
  
  // 分享给朋友
  onShareAppMessage() {
    return {
      title: '湖院通 - 消息中心',
      path: '/pages/word/word',
      imageUrl: '/images/share-cover.png'
    };
  },
  
  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '湖院通 - 消息中心',
      imageUrl: '/images/share-cover.png'
    };
  }
})