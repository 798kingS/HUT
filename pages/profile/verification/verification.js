// pages/profile/verification/verification.js
const app = getApp();

Page({
  data: {
    formData: {
      realName: '',
      studentId: '',
      college: '',
      major: '',
      grade: '',
      phone: '',
      verificationCode: '',
      studentCardPhoto: ''
    },
    colleges: [
      { name: '电子信息学院', value: '电子信息学院' },
      { name: '智能制造学院', value: '智能制造学院' },
      { name: '理工学院', value: '理工学院' },
      { name: '人文学院', value: '人文学院' },
      { name: '经济管理学院', value: '经济管理学院' },
      { name: '马克思主义学院', value: '马克思主义学院' },
      { name: '继续教育学院', value: '继续教育学院' },
      { name: '生命健康学院', value: '生命健康学院' },
      { name: '设计学院', value: '设计学院' },
    ],
    collegeIndex: 0,
    grades: ['2022级', '2023级', '2024级', '2025级'],
    gradeIndex: 0,
    codeSent: false,
    canSendCode: false,
    codeCountdown: 0,
    verificationStatus: '', // verified, pending, rejected
    rejectionReason: '',
    submitting: false,
    canSubmit: false
  },

  onLoad(options) {
    this.loadVerificationData();
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadVerificationData();
  },

  // 加载认证数据
  loadVerificationData() {
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo');
    const verificationData = wx.getStorageSync('verificationData') || {};
    
    if (verificationData && Object.keys(verificationData).length > 0) {
      // 如果有已保存的认证数据，加载它
      this.setData({
        formData: {
          realName: verificationData.realName || '',
          studentId: verificationData.studentId || '',
          college: verificationData.college || '',
          major: verificationData.major || '',
          grade: verificationData.grade || '',
          phone: verificationData.phone || '',
          verificationCode: '',
          studentCardPhoto: verificationData.studentCardPhoto || ''
        },
        verificationStatus: verificationData.status || '',
        rejectionReason: verificationData.rejectionReason || ''
      });

      // 设置学院和年级的索引
      if (verificationData.college) {
        const collegeIndex = this.data.colleges.findIndex(item => item.value === verificationData.college);
        if (collegeIndex !== -1) {
          this.setData({ collegeIndex });
        }
      }
      if (verificationData.grade) {
        const gradeIndex = this.data.grades.indexOf(verificationData.grade);
        if (gradeIndex !== -1) {
          this.setData({ gradeIndex });
        }
      }
      
      // 如果已有验证码发送记录，显示验证码输入框
      if (verificationData.phone && this.isValidPhone(verificationData.phone)) {
        this.setData({
          codeSent: true,
          canSendCode: true
        });
      }
    } else if (userInfo) {
      // 如果有用户信息，填充部分数据
      this.setData({
        'formData.phone': userInfo.phone || '',
        canSendCode: this.isValidPhone(userInfo.phone || '')
      });
    }
    
    // 延迟检查表单，确保数据已加载
    setTimeout(() => {
      this.checkFormValid();
    }, 100);
  },

  // 返回
  goBack() {
    wx.navigateBack();
  },

  // 姓名输入
  onRealNameInput(e) {
    this.setData({
      'formData.realName': e.detail.value
    });
    this.checkFormValid();
  },

  // 学号输入
  onStudentIdInput(e) {
    this.setData({
      'formData.studentId': e.detail.value
    });
    this.checkFormValid();
  },

  // 学院选择
  onCollegeChange(e) {
    const index = parseInt(e.detail.value);
    const college = this.data.colleges[index];
    this.setData({
      collegeIndex: index,
      'formData.college': college.value
    });
    this.checkFormValid();
  },

  // 专业输入
  onMajorInput(e) {
    this.setData({
      'formData.major': e.detail.value
    });
    this.checkFormValid();
  },

  // 年级选择
  onGradeChange(e) {
    const index = parseInt(e.detail.value);
    const grade = this.data.grades[index];
    this.setData({
      gradeIndex: index,
      'formData.grade': grade
    });
    this.checkFormValid();
  },

  // 手机号输入
  onPhoneInput(e) {
    const phone = e.detail.value;
    this.setData({
      'formData.phone': phone,
      canSendCode: this.isValidPhone(phone)
    });
    this.checkFormValid();
  },

  // 验证码输入
  onVerificationCodeInput(e) {
    this.setData({
      'formData.verificationCode': e.detail.value
    });
    this.checkFormValid();
  },

  // onReady时检查表单
  onReady() {
    this.checkFormValid();
  },

  // 验证手机号格式
  isValidPhone(phone) {
    return /^1[3-9]\d{9}$/.test(phone);
  },

  // 发送验证码
  sendVerificationCode() {
    if (!this.data.canSendCode || this.data.codeCountdown > 0) {
      return;
    }

    const phone = this.data.formData.phone;
    if (!this.isValidPhone(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    // 模拟发送验证码
    wx.showLoading({
      title: '发送中...'
    });

    setTimeout(() => {
      wx.hideLoading();
      // 模拟验证码（实际应该从后端获取）
      const code = '123456'; // 实际应该从后端返回
      wx.setStorageSync('verificationCode', code);
      
      this.setData({
        codeSent: true,
        codeCountdown: 60
      });

      // 开始倒计时
      const timer = setInterval(() => {
        if (this.data.codeCountdown > 0) {
          this.setData({
            codeCountdown: this.data.codeCountdown - 1
          });
        } else {
          clearInterval(timer);
        }
      }, 1000);

      // 检查表单有效性
      this.checkFormValid();

      wx.showToast({
        title: '验证码已发送',
        icon: 'success'
      });
    }, 1000);

    // 实际应该调用后端API
    // wx.request({
    //   url: `${app.globalData.baseUrl}/sendVerificationCode`,
    //   method: 'POST',
    //   data: { phone },
    //   success: (res) => {
    //     // 处理成功
    //   },
    //   fail: (err) => {
    //     // 处理失败
    //   }
    // });
  },

  // 上传学生证
  uploadStudentCard() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0];
        
        // 显示预览
        this.setData({
          'formData.studentCardPhoto': tempFilePath
        });

        // 实际应该上传到服务器
        // this.uploadImageToServer(tempFilePath);
        this.checkFormValid();
      },
      fail: (err) => {
        console.log('选择图片失败:', err);
        wx.showToast({
          title: '选择图片失败',
          icon: 'none'
        });
      }
    });
  },

  // 预览学生证
  previewStudentCard() {
    wx.previewImage({
      urls: [this.data.formData.studentCardPhoto],
      current: this.data.formData.studentCardPhoto
    });
  },

  // 删除学生证
  deleteStudentCard() {
    wx.showModal({
      title: '确认删除',
      content: '确定要删除学生证照片吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            'formData.studentCardPhoto': ''
          });
          this.checkFormValid();
        }
      }
    });
  },

  // 检查表单是否有效
  checkFormValid() {
    const { formData, verificationStatus, codeSent } = this.data;
    // 如果已认证或审核中，不能提交
    if (verificationStatus === 'verified' || verificationStatus === 'pending') {
      this.setData({ canSubmit: false });
      return;
    }
    
    // 检查必填项
    const canSubmit = 
      formData.realName &&
      formData.studentId &&
      formData.college &&
      formData.major &&
      formData.grade &&
      this.isValidPhone(formData.phone) &&
      codeSent &&
      formData.verificationCode &&
      formData.studentCardPhoto;

    this.setData({ canSubmit });
  },

  // 提交认证
  submitVerification() {
    if (!this.data.canSubmit || this.data.submitting) {
      return;
    }

    const { formData } = this.data;

    // 验证验证码（实际应该调用后端API验证）
    const savedCode = wx.getStorageSync('verificationCode');
    if (formData.verificationCode !== savedCode && formData.verificationCode !== '123456') {
      wx.showToast({
        title: '验证码错误',
        icon: 'none'
      });
      return;
    }

    this.setData({ submitting: true });

    // 保存认证数据
    const verificationData = {
      ...formData,
      status: 'pending',
      submitTime: new Date().toISOString()
    };

    wx.setStorageSync('verificationData', verificationData);

    // 更新用户信息
    const userInfo = app.globalData.userInfo || wx.getStorageSync('userInfo') || {};
    userInfo.realName = formData.realName;
    userInfo.studentId = formData.studentId;
    userInfo.college = formData.college;
    userInfo.major = formData.major;
    userInfo.grade = formData.grade;
    userInfo.phone = formData.phone;
    userInfo.verificationStatus = 'pending';
    
    app.globalData.userInfo = userInfo;
    wx.setStorageSync('userInfo', userInfo);

    // 模拟提交到后端
    setTimeout(() => {
      this.setData({
        submitting: false,
        verificationStatus: 'pending',
        'formData.verificationCode': ''
      });

      wx.showToast({
        title: '提交成功',
        icon: 'success'
      });

      // 实际应该调用后端API
      // wx.request({
      //   url: `${app.globalData.baseUrl}/submitVerification`,
      //   method: 'POST',
      //   data: verificationData,
      //   success: (res) => {
      //     // 处理成功
      //   },
      //   fail: (err) => {
      //     // 处理失败
      //   }
      // });
    }, 1500);
  }
});

