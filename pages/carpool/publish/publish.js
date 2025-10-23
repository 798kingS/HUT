const app = getApp();

Page({
  data: {
    formData: {
      departure: '',
      destination: '',
      departureDate: '',
      departureTime: '',
      arrivalTime: '',
      carType: '',
      seats: '',
      price: '',
      phone: '',
      wechat: '',
      remark: ''
    },
    carTypes: ['轿车', 'SUV', '面包车', '大巴', '其他'],
    carTypeIndex: -1,
    seatOptions: ['1座', '2座', '3座', '4座', '5座', '6座', '7座', '8座以上'],
    seatIndex: -1,
    images: [],
    submitting: false
  },

  onLoad() {
    // 设置默认日期为明天
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    
    this.setData({
      'formData.departureDate': dateStr
    });
  },

  // 输入框变化
  inputChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`formData.${field}`]: value
    });
  },

  // 日期选择
  dateChange(e) {
    this.setData({
      'formData.departureDate': e.detail.value
    });
  },

  // 时间选择
  timeChange(e) {
    this.setData({
      'formData.departureTime': e.detail.value
    });
  },

  // 到达时间选择
  arrivalTimeChange(e) {
    this.setData({
      'formData.arrivalTime': e.detail.value
    });
  },

  // 车型选择
  carTypeChange(e) {
    const index = e.detail.value;
    this.setData({
      carTypeIndex: index,
      'formData.carType': this.data.carTypes[index]
    });
  },

  // 座位数选择
  seatChange(e) {
    const index = e.detail.value;
    this.setData({
      seatIndex: index,
      'formData.seats': this.data.seatOptions[index]
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
    
    if (!formData.departure.trim()) {
      wx.showToast({
        title: '请输入出发地',
        icon: 'error'
      });
      return false;
    }
    
    if (!formData.destination.trim()) {
      wx.showToast({
        title: '请输入目的地',
        icon: 'error'
      });
      return false;
    }
    
    if (!formData.departureDate) {
      wx.showToast({
        title: '请选择出发日期',
        icon: 'error'
      });
      return false;
    }
    
    if (!formData.departureTime) {
      wx.showToast({
        title: '请选择出发时间',
        icon: 'error'
      });
      return false;
    }
    
    if (!formData.carType) {
      wx.showToast({
        title: '请选择车型',
        icon: 'error'
      });
      return false;
    }
    
    if (!formData.seats) {
      wx.showToast({
        title: '请选择座位数',
        icon: 'error'
      });
      return false;
    }
    
    if (!formData.price || formData.price <= 0) {
      wx.showToast({
        title: '请输入有效价格',
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
        url: `${app.globalData.baseUrl}/carpool/publish`,
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