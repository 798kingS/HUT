const app = getApp();

Page({
  data: {
    formData: {
      title: '',
      author: '',
      publisher: '',
      isbn: '',
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

  onLoad() {
    // 页面加载时的初始化
  },

  // 输入框变化
  inputChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`formData.${field}`]: value
    });
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
      count: count,
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
    this.setData({
      images: images
    });
  },

  // 表单验证
  validateForm() {
    const formData = this.data.formData;
    
    if (!formData.title.trim()) {
      wx.showToast({
        title: '请输入书名',
        icon: 'error'
      });
      return false;
    }
    
    if (!formData.author.trim()) {
      wx.showToast({
        title: '请输入作者',
        icon: 'error'
      });
      return false;
    }
    
    if (!formData.publisher.trim()) {
      wx.showToast({
        title: '请输入出版社',
        icon: 'error'
      });
      return false;
    }
    
    if (!formData.price || formData.price <= 0) {
      wx.showToast({
        title: '请输入有效售价',
        icon: 'error'
      });
      return false;
    }
    
    if (!formData.condition) {
      wx.showToast({
        title: '请选择成色',
        icon: 'error'
      });
      return false;
    }
    
    if (!formData.location.trim()) {
      wx.showToast({
        title: '请输入交易地点',
        icon: 'error'
      });
      return false;
    }
    
    if (!formData.phone.trim()) {
      wx.showToast({
        title: '请输入手机号',
        icon: 'error'
      });
      return false;
    }
    
    // 验证手机号格式
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'error'
      });
      return false;
    }
    
    return true;
  },

  // 上传图片
  uploadImages() {
    return new Promise((resolve, reject) => {
      if (this.data.images.length === 0) {
        resolve([]);
        return;
      }
      
      const uploadPromises = this.data.images.map((filePath, index) => {
        return new Promise((resolve, reject) => {
          wx.uploadFile({
            url: `${app.globalData.baseUrl}/upload`,
            filePath: filePath,
            name: 'file',
            header: {
              'Authorization': `Bearer ${app.globalData.token}`
            },
            success: (res) => {
              const data = JSON.parse(res.data);
              if (data.success) {
                resolve(data.url);
              } else {
                reject(data.message);
              }
            },
            fail: reject
          });
        });
      });
      
      Promise.all(uploadPromises)
        .then(resolve)
        .catch(reject);
    });
  },

  // 提交表单
  submitForm(e) {
    if (!this.validateForm()) {
      return;
    }
    
    this.setData({ submitting: true });
    
    // 先上传图片
    this.uploadImages().then((imageUrls) => {
      // 提交表单数据
      const formData = {
        ...this.data.formData,
        images: imageUrls,
        userId: app.globalData.userInfo.userId,
        createTime: new Date().toISOString()
      };
      
      wx.request({
        url: `${app.globalData.baseUrl}/books/publish`,
        method: 'POST',
        data: formData,
        header: {
          'Authorization': `Bearer ${app.globalData.token}`,
          'Content-Type': 'application/json'
        },
        success: (res) => {
          if (res.data.success) {
            wx.showToast({
              title: '发布成功',
              icon: 'success'
            });
            
            // 返回上一页
            setTimeout(() => {
              wx.navigateBack();
            }, 1500);
          } else {
            wx.showToast({
              title: res.data.message || '发布失败',
              icon: 'error'
            });
          }
        },
        fail: (err) => {
          console.log('发布失败:', err);
          wx.showToast({
            title: '网络错误，请重试',
            icon: 'error'
          });
        },
        complete: () => {
          this.setData({ submitting: false });
        }
      });
    }).catch((err) => {
      console.log('图片上传失败:', err);
      wx.showToast({
        title: '图片上传失败',
        icon: 'error'
      });
      this.setData({ submitting: false });
    });
  }
}); 