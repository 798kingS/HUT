package com.huyuantong.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.huyuantong.entity.User;
import com.huyuantong.mapper.UserMapper;
import com.huyuantong.service.UserService;
import org.springframework.stereotype.Service;

/**
 * 用户服务实现类
 */
@Service
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {
    
    @Override
    public User getByOpenid(String openid) {
        LambdaQueryWrapper<User> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(User::getOpenid, openid);
        return this.getOne(wrapper);
    }
    
    @Override
    public User loginOrRegister(String openid, String nickname, String avatar) {
        // 先查询用户是否存在
        User user = getByOpenid(openid);
        
        if (user == null) {
            // 用户不存在，创建新用户
            user = new User();
            user.setOpenid(openid);
            user.setNickname(nickname);
            user.setAvatar(avatar);
            user.setStatus(1);
            this.save(user);
        } else {
            // 用户存在，更新信息
            user.setNickname(nickname);
            user.setAvatar(avatar);
            this.updateById(user);
        }
        
        return user;
    }
} 