# 湖院通微信小程序后端服务

## 项目简介

湖院通微信小程序后端服务，基于Spring Boot + MyBatis Plus + MySQL开发，提供校园拼车、校园卖书、校园论坛等功能的后端API支持。

## 技术栈

- **框架**: Spring Boot 2.7.14
- **ORM**: MyBatis Plus 3.5.3.1
- **数据库**: MySQL 8.0+
- **连接池**: Druid 1.2.18
- **JSON**: FastJSON 2.0.32
- **工具**: Lombok

## 项目结构

```
backend/
├── src/main/java/com/huyuantong/
│   ├── HuyuantongApplication.java          # 启动类
│   ├── common/
│   │   └── Result.java                     # 统一响应结果
│   ├── controller/                         # 控制器层
│   │   ├── ForumController.java           # 论坛控制器
│   │   ├── CarpoolController.java         # 拼车控制器
│   │   └── BookController.java            # 二手书控制器
│   ├── entity/                            # 实体类
│   │   ├── User.java                      # 用户实体
│   │   ├── ForumPost.java                 # 论坛帖子实体
│   │   ├── Carpool.java                   # 拼车实体
│   │   └── Book.java                      # 二手书实体
│   ├── mapper/                            # 数据访问层
│   │   ├── UserMapper.java
│   │   ├── ForumPostMapper.java
│   │   ├── CarpoolMapper.java
│   │   └── BookMapper.java
│   └── service/                           # 服务层
│       ├── UserService.java
│       ├── ForumPostService.java
│       ├── CarpoolService.java
│       ├── BookService.java
│       └── impl/                          # 服务实现类
│           ├── UserServiceImpl.java
│           ├── ForumPostServiceImpl.java
│           ├── CarpoolServiceImpl.java
│           └── BookServiceImpl.java
├── src/main/resources/
│   ├── application.yml                    # 配置文件
│   └── sql/
│       └── huyuantong.sql                 # 数据库建表脚本
└── pom.xml                                # Maven配置
```

## 功能模块

### 1. 用户管理
- 用户注册/登录
- 用户信息管理

### 2. 校园论坛
- 发布帖子
- 帖子列表查询（全部/热门/精华）
- 帖子点赞/收藏
- 帖子详情查看

### 3. 校园拼车
- 发布拼车信息
- 拼车列表查询
- 加入拼车
- 拼车状态管理

### 4. 校园卖书
- 发布二手书
- 二手书列表查询
- 购买二手书
- 书籍状态管理

## API接口

### 论坛相关接口
- `GET /api/forum/posts` - 获取帖子列表
- `POST /api/forum/post` - 发布帖子
- `POST /api/forum/post/{id}/like` - 点赞帖子
- `POST /api/forum/post/{id}/collect` - 收藏帖子
- `GET /api/forum/post/{id}` - 获取帖子详情

### 拼车相关接口
- `GET /api/carpool/list` - 获取拼车列表
- `POST /api/carpool/publish` - 发布拼车信息
- `GET /api/carpool/{id}` - 获取拼车详情
- `POST /api/carpool/{id}/join` - 加入拼车

### 二手书相关接口
- `GET /api/book/list` - 获取二手书列表
- `POST /api/book/publish` - 发布二手书
- `GET /api/book/{id}` - 获取二手书详情
- `POST /api/book/{id}/buy` - 购买二手书

## 数据库设计

### 用户表 (user)
- 存储用户基本信息
- 包含微信openid、昵称、头像等字段

### 论坛帖子表 (forum_post)
- 存储论坛帖子信息
- 包含标题、内容、图片、点赞数等字段

### 拼车表 (carpool)
- 存储拼车信息
- 包含出发地、目的地、出发时间、座位数等字段

### 二手书表 (book)
- 存储二手书信息
- 包含书名、作者、价格、成色等字段

## 部署说明

### 1. 环境要求
- JDK 8+
- MySQL 8.0+
- Maven 3.6+

### 2. 数据库配置
1. 创建数据库：`huyuantong`
2. 执行SQL脚本：`src/main/resources/sql/huyuantong.sql`
3. 修改配置文件中的数据库连接信息

### 3. 启动项目
```bash
# 进入项目目录
cd backend

# 编译项目
mvn clean compile

# 运行项目
mvn spring-boot:run
```

### 4. 访问地址
- 服务地址：http://localhost:8080
- API文档：http://localhost:8080/api
- Druid监控：http://localhost:8080/druid

## 配置说明

### 数据库配置
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/huyuantong?useUnicode=true&characterEncoding=utf8&serverTimezone=GMT%2B8
    username: root
    password: 123456
```

### MyBatis Plus配置
- 开启驼峰命名转换
- 配置逻辑删除
- 配置分页插件

## 开发规范

1. **命名规范**
   - 类名：大驼峰命名
   - 方法名：小驼峰命名
   - 数据库字段：下划线命名

2. **代码规范**
   - 使用Lombok简化代码
   - 统一使用Result返回结果
   - 添加必要的注释

3. **数据库规范**
   - 使用逻辑删除
   - 添加创建时间和更新时间
   - 合理设置索引

## 注意事项

1. 生产环境部署时需要修改数据库密码
2. 建议配置HTTPS
3. 注意数据安全和用户隐私保护
4. 定期备份数据库 