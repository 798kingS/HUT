Page({
  data: {
    currentTab: 'all',
    postList: [],
    loading: false,
    hasMore: true,
    page: 1,
    pageSize: 10
  },

  onLoad() {
    this.loadPostList();
  },

  // Tab切换
  switchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({
      currentTab: tab,
      page: 1,
      hasMore: true,
      postList: []
    });
    this.loadPostList();
  },

  // 加载帖子列表（模拟数据）
  loadPostList() {
    this.setData({ loading: true });
    const mockData = [
      {
        id: 1,
        avatar: '/images/头像.png',
        username: '小明',
        time: '2小时前',
        tag: '热门',
        title: '明天有一起去市区的吗？',
        content: '明天上午想去市区，有顺路的吗？可以拼车一起走。',
        images: ['https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80'],
        likes: 12,
        collects: 5,
        comments: 3
      },
      {
        id: 2,
        avatar: '/images/头像.png',
        username: '小红',
        time: '4小时前',
        tag: '精华',
        title: '分享一下考研经验',
        content: '今年考研上岸，欢迎大家提问交流！',
        images: [],
        likes: 20,
        collects: 10,
        comments: 8
      },
      {
        id: 3,
        avatar: '/images/头像.png',
        username: '小李',
        time: '6小时前',
        tag: '',
        title: '食堂新菜品好吃吗？',
        content: '大家觉得新食堂的菜怎么样？有没有推荐的？',
        images: ['https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80'],
        likes: 6,
        collects: 2,
        comments: 1
      }
    ];
    setTimeout(() => {
      this.setData({
        postList: mockData,
        loading: false
      });
    }, 800);
  },

  // 加载更多
  loadMore() {
    if (this.data.loading || !this.data.hasMore) return;
    this.setData({ loading: true, page: this.data.page + 1 });
    // 模拟加载更多
    setTimeout(() => {
      const newData = [
        {
          id: this.data.postList.length + 1,
          avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80',
          username: '新同学',
          time: '1小时前',
          tag: '',
          title: '新生报到，有没有同专业的？',
          content: '刚到学校，想认识一下同专业的同学。',
          images: [],
          likes: 0,
          collects: 0,
          comments: 0
        }
      ];
      this.setData({
        postList: [...this.data.postList, ...newData],
        loading: false,
        hasMore: this.data.page < 3
      });
    }, 800);
  },

  // 点赞
  likePost(e) {
    const id = e.currentTarget.dataset.id;
    const postList = this.data.postList.map(item => {
      if (item.id === id) {
        return { ...item, likes: item.likes + 1 };
      }
      return item;
    });
    this.setData({ postList });
    wx.showToast({ title: '点赞成功', icon: 'success' });
  },
  // 收藏
  collectPost(e) {
    const id = e.currentTarget.dataset.id;
    const postList = this.data.postList.map(item => {
      if (item.id === id) {
        return { ...item, collects: item.collects + 1 };
      }
      return item;
    });
    this.setData({ postList });
    wx.showToast({ title: '收藏成功', icon: 'success' });
  },
  // 评论
  commentPost(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({ title: '评论功能开发中', icon: 'none' });
  },
  // 查看详情
  viewDetail(e) {
    const item = e.currentTarget.dataset.item;
    wx.navigateTo({ url: `/pages/forum/detail/detail?id=${item.id}` });
  },
  // 发帖
  goToPost() {
    wx.navigateTo({ url: '/pages/forum/publish/publish' });
  },

  // 显示搜索
  showSearch() {
    wx.showToast({
      title: '搜索功能开发中',
      icon: 'none'
    });
  },

  // 分享帖子
  sharePost(e) {
    const id = e.currentTarget.dataset.id;
    wx.showToast({
      title: '分享成功',
      icon: 'success'
    });
  }
});