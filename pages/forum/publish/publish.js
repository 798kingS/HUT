const app = getApp();

Page({
  data: {
    formData: {
      title: '',
      content: '',
      location: '',
      category: '',
      tags: [],
      allowComment: true,
      anonymous: false
    },
    categories: ['校园生活', '学习交流', '活动分享', '问题求助', '其他'],
    categoryIndex: -1,
    selectedTags: [],
    suggestedTags: ['湖州学院', '学习', '生活', '活动', '求助', '分享', '讨论'],
    images: [],
    submitting: false
  },

  onLoad() {
    // 页面加载时的初始化
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  },

  // 输入框变化
  inputChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`formData.${field}`]: value
    });
  },

  // 分类选择
  categoryChange(e) {
    const index = e.detail.value;
    this.setData({
      categoryIndex: index,
      'formData.category': this.data.categories[index]
    });
  },

  // 添加标签
  addTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const selectedTags = this.data.selectedTags;
    
    if (selectedTags.length >= 5) {
      wx.showToast({
        title: '最多添加5个标签',
        icon: 'error'
      });
      return;
    }
    
    if (selectedTags.includes(tag)) {
      wx.showToast({
        title: '标签已存在',
        icon: 'error'
      });
      return;
    }
    
    selectedTags.push(tag);
    this.setData({
      selectedTags: selectedTags,
      'formData.tags': selectedTags
    });
  },

  // 移除标签
  removeTag(e) {
    const tag = e.currentTarget.dataset.tag;
    const selectedTags = this.data.selectedTags.filter(item => item !== tag);
    
    this.setData({
      selectedTags: selectedTags,
      'formData.tags': selectedTags
    });
  },

  // 评论开关
  commentSwitchChange(e) {
    this.setData({
      'formData.allowComment': e.detail.value
    });
  },

  // 匿名开关
  anonymousSwitchChange(e) {
    this.setData({
      'formData.anonymous': e.detail.value
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
        title: '请输入标题',
        icon: 'error'
      });
      return false;
    }
    
    if (formData.title.length < 5) {
      wx.showToast({
        title: '标题至少5个字符',
        icon: 'error'
      });
      return false;
    }
    
    if (!formData.content.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'error'
      });
      return false;
    }
    
    if (formData.content.length < 10) {
      wx.showToast({
        title: '内容至少10个字符',
        icon: 'error'
      });
      return false;
    }
    
    if (!formData.category) {
      wx.showToast({
        title: '请选择分类',
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
        url: `${app.globalData.baseUrl}/forum/publish`,
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