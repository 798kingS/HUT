-- 湖院通微信小程序数据库建表脚本

-- 创建数据库
CREATE DATABASE IF NOT EXISTS huyuantong DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE huyuantong;

-- 用户表
CREATE TABLE `user` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `openid` varchar(100) NOT NULL COMMENT '微信openid',
  `nickname` varchar(50) DEFAULT NULL COMMENT '昵称',
  `avatar` varchar(500) DEFAULT NULL COMMENT '头像',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `student_id` varchar(20) DEFAULT NULL COMMENT '学号',
  `college` varchar(50) DEFAULT NULL COMMENT '学院',
  `major` varchar(50) DEFAULT NULL COMMENT '专业',
  `grade` varchar(20) DEFAULT NULL COMMENT '年级',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态 0-禁用 1-正常',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除 0-未删除 1-已删除',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- 论坛帖子表
CREATE TABLE `forum_post` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `title` varchar(200) NOT NULL COMMENT '标题',
  `content` text COMMENT '内容',
  `images` text COMMENT '图片，多个用逗号分隔',
  `tag` varchar(50) DEFAULT NULL COMMENT '标签',
  `likes` int(11) DEFAULT '0' COMMENT '点赞数',
  `collects` int(11) DEFAULT '0' COMMENT '收藏数',
  `comments` int(11) DEFAULT '0' COMMENT '评论数',
  `views` int(11) DEFAULT '0' COMMENT '浏览量',
  `is_essence` tinyint(1) DEFAULT '0' COMMENT '是否精华 0-否 1-是',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态 0-待审核 1-正常 2-已删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除 0-未删除 1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='论坛帖子表';

-- 拼车表
CREATE TABLE `carpool` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `start_location` varchar(100) NOT NULL COMMENT '出发地',
  `end_location` varchar(100) NOT NULL COMMENT '目的地',
  `departure_time` datetime NOT NULL COMMENT '出发时间',
  `seats` int(11) NOT NULL COMMENT '座位数',
  `occupied_seats` int(11) DEFAULT '0' COMMENT '已占座位数',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `contact` varchar(100) NOT NULL COMMENT '联系方式',
  `remark` text COMMENT '备注',
  `status` tinyint(1) DEFAULT '0' COMMENT '状态 0-待拼车 1-拼车中 2-已完成 3-已取消',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除 0-未删除 1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_departure_time` (`departure_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='拼车表';

-- 二手书表
CREATE TABLE `book` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `user_id` bigint(20) NOT NULL COMMENT '用户ID',
  `title` varchar(200) NOT NULL COMMENT '书名',
  `author` varchar(100) DEFAULT NULL COMMENT '作者',
  `publisher` varchar(100) DEFAULT NULL COMMENT '出版社',
  `isbn` varchar(20) DEFAULT NULL COMMENT 'ISBN',
  `price` decimal(10,2) NOT NULL COMMENT '价格',
  `original_price` decimal(10,2) DEFAULT NULL COMMENT '原价',
  `condition` tinyint(1) DEFAULT '3' COMMENT '成色 1-全新 2-九成新 3-八成新 4-七成新 5-六成新及以下',
  `images` text COMMENT '图片，多个用逗号分隔',
  `description` text COMMENT '描述',
  `contact` varchar(100) NOT NULL COMMENT '联系方式',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态 0-待审核 1-在售 2-已售出 3-已下架',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted` tinyint(1) DEFAULT '0' COMMENT '逻辑删除 0-未删除 1-已删除',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='二手书表';

-- 插入测试数据
INSERT INTO `user` (`openid`, `nickname`, `avatar`, `student_id`, `college`, `major`, `grade`) VALUES
('test_openid_1', '小明', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80', '2021001', '计算机学院', '软件工程', '2021级'),
('test_openid_2', '小红', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=crop&w=100&q=80', '2021002', '经济学院', '金融学', '2021级'),
('test_openid_3', '小李', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80', '2021003', '文学院', '汉语言文学', '2021级');

INSERT INTO `forum_post` (`user_id`, `title`, `content`, `images`, `tag`, `likes`, `collects`, `comments`, `views`, `is_essence`) VALUES
(1, '明天有一起去市区的吗？', '明天上午想去市区，有顺路的吗？可以拼车一起走。', 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=200&q=80', '热门', 12, 5, 3, 50, 0),
(2, '分享一下考研经验', '今年考研上岸，欢迎大家提问交流！', '', '精华', 20, 10, 8, 120, 1),
(3, '食堂新菜品好吃吗？', '大家觉得新食堂的菜怎么样？有没有推荐的？', 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=200&q=80', '', 6, 2, 1, 30, 0);

INSERT INTO `carpool` (`user_id`, `start_location`, `end_location`, `departure_time`, `seats`, `occupied_seats`, `price`, `contact`, `remark`) VALUES
(1, '湖州学院', '湖州市区', '2024-01-15 09:00:00', 4, 1, 15.00, '13800138001', '有3个空位，欢迎拼车'),
(2, '湖州学院', '杭州东站', '2024-01-16 08:00:00', 3, 0, 25.00, '13800138002', '去杭州东站，有3个空位'),
(3, '湖州学院', '上海虹桥', '2024-01-17 07:00:00', 5, 2, 35.00, '13800138003', '去上海，还有3个空位');

INSERT INTO `book` (`user_id`, `title`, `author`, `publisher`, `isbn`, `price`, `original_price`, `condition`, `images`, `description`, `contact`) VALUES
(1, 'Java核心技术', 'Cay S. Horstmann', '机械工业出版社', '9787111213826', 25.00, 89.00, 3, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80', '八成新，有少量笔记', '13800138001'),
(2, '高等数学', '同济大学数学系', '高等教育出版社', '9787040396638', 15.00, 45.00, 4, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', '七成新，有笔记', '13800138002'),
(3, '英语四级词汇', '新东方', '群言出版社', '9787802566394', 10.00, 35.00, 2, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80', '九成新，几乎全新', '13800138003'); 