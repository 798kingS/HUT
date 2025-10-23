package com.huyuantong.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.huyuantong.entity.User;

/**
 * 用户服务接口
 */
public interface UserService extends IService<User> {
    
    /**
     * 根据openid获取用户
     */
    User getByOpenid(String openid);
    
    /**
     * 用户登录或注册
     */
    User loginOrRegister(String openid, String nickname, String avatar);
} 