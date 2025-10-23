// pages/else/publish/publish.js
const app = getApp();

Page({
  data: {
    formData: {
      title: '',
      originalPrice: '',
      price: '',
      condition: '',
      location: '',
      phone: '',
      wechat: '',
      description: ''
    },
    conditions: ['全新', '九成新', '八成新', '七成新', '六成新', '五成新及以下'],
    conditionIndex: -1,
    images: [],
    submitting: false
  },

  onLoad() {},

  // 输入框变化
  inputChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({ [`formData.${field}`]: value });
  },

  // 成色选择
  conditionChange(e) {
    const index = e.detail.value;
    this.setData({
      conditionIndex: index,
      'formData.condition': this.data.conditions[index]
    });
  },

  // 选择图片
  chooseImage() {
    const count = 9 - this.data.images.length;
    wx.chooseImage({
      count,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: [...this.data.images, ...res.tempFilePaths]
        });
      }
    });
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.images;
    images.splice(index, 1);
    this.setData({ images });
  },

  // 表单验证（闲置物品）
  validateForm() {
    const formData = this.data.formData;

    if (!formData.title.trim()) {
      wx.showToast({ title: '请输入物品名称', icon: 'error' });
      return false;
    }
    if (!formData.price || formData.price <= 0) {
      wx.showToast({ title: '请输入有效售价', icon: 'error' });
      return false;
    }
    if (!formData.condition) {
      wx.showToast({ title: '请选择成色', icon: 'error' });
      return false;
    }
    if (!formData.location.trim()) {
      wx.showToast({ title: '请输入交易地点', icon: 'error' });
      return false;
    }
    if (!formData.phone.trim()) {
      wx.showToast({ title: '请输入手机号', icon: 'error' });
      return false;
    }
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      wx.showToast({ title: '请输入正确的手机号', icon: 'error' });
      return false;
    }
    return true;
  },

  // 上传图片（本地模拟：直接返回临时路径）
  uploadImages() {
    return new Promise((resolve) => {
      resolve(this.data.images || []);
    });
  },

  // 提交表单
  submitForm() {
    if (!this.validateForm()) return;
    this.setData({ submitting: true });

    this.uploadImages()
      .then((imageUrls) => {
        const formData = {
          ...this.data.formData,
          images: imageUrls
        };

        // 本地模拟发布（后端请求已注释）
        /*
        wx.request({
          url: `http://localhost:8081/api/else/add`,
          method: 'POST',
          data: formData,
          header: { 'Content-Type': 'application/json' },
          success: (res) => { ... }
        });
        */

        // 将新发布的物品立即写入本地列表，并附加更多模拟数据
        const existing = wx.getStorageSync('itemlist') || [];
        const nowId = Date.now();
        const newItem = {
          id: nowId,
          title: formData.title,
          category: '闲置物品',
          price: Number(formData.price) || 0,
          condition: formData.condition,
          description: formData.description,
          images: (formData.images && formData.images[0]) || '',
          sellerName: (app.globalData.userInfo && app.globalData.userInfo.nickName) || '校园同学',
          sellerAvatar: (app.globalData.userInfo && app.globalData.userInfo.avatarUrl) || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
          publishTime: '刚刚',
          likes: 0,
          collects: 0
        };

        // 追加更多模拟数据条目
        const sampleTitles = ['学习台灯', 'U盘32G', '电脑支架', '英汉词典', '运动水壶', '蓝牙音箱', '折叠伞', '羽毛球拍', '画板', '手持风扇'];
        const sampleImages = [
          'https://images.unsplash.com/photo-1516387938699-a93567ec168e?auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=300&q=80',
          'https://images.unsplash.com/photo-1518443895914-1f1d4c9c38e0?auto=format&fit=crop&w=300&q=80'
        ];
        const conditions = ['全新', '九成新', '八成新', '七成新'];
        const extraMocks = Array.from({ length: 8 }).map((_, i) => ({
          id: nowId + i + 1,
          title: sampleTitles[i % sampleTitles.length],
          category: '闲置物品',
          price: Math.floor(10 + Math.random() * 200),
          condition: conditions[i % conditions.length],
          description: '功能完好，支持当面验货。',
          images: sampleImages[i % sampleImages.length],
          sellerName: '校园同学',
          sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
          publishTime: '刚刚',
          likes: Math.floor(Math.random() * 10),
          collects: Math.floor(Math.random() * 6)
        }));

        const merged = [newItem, ...extraMocks, ...existing];
        wx.setStorageSync('itemlist', merged);

        wx.showToast({ title: '发布成功', icon: 'success' });
        setTimeout(() => { wx.navigateBack(); }, 1200);
      })
      .catch(() => {
        wx.showToast({ title: '图片上传失败', icon: 'error' });
        this.setData({ submitting: false });
      });
  }
});