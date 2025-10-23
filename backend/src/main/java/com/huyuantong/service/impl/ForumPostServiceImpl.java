package com.huyuantong.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.huyuantong.entity.ForumPost;
import com.huyuantong.mapper.ForumPostMapper;
import com.huyuantong.service.ForumPostService;
import org.springframework.stereotype.Service;

/**
 * 论坛帖子服务实现类
 */
@Service
public class ForumPostServiceImpl extends ServiceImpl<ForumPostMapper, ForumPost> implements ForumPostService {
    
    @Override
    public IPage<ForumPost> getPostList(Integer page, Integer size, String type) {
        Page<ForumPost> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<ForumPost> wrapper = new LambdaQueryWrapper<>();
        
        // 根据类型筛选
        if ("hot".equals(type)) {
            wrapper.orderByDesc(ForumPost::getLikes, ForumPost::getComments);
        } else if ("essence".equals(type)) {
            wrapper.eq(ForumPost::getIsEssence, 1);
            wrapper.orderByDesc(ForumPost::getCreateTime);
        } else {
            wrapper.orderByDesc(ForumPost::getCreateTime);
        }
        
        wrapper.eq(ForumPost::getStatus, 1);
        return this.page(pageParam, wrapper);
    }
    
    @Override
    public boolean publishPost(ForumPost post) {
        post.setLikes(0);
        post.setCollects(0);
        post.setComments(0);
        post.setViews(0);
        post.setIsEssence(0);
        post.setStatus(1);
        return this.save(post);
    }
    
    @Override
    public boolean likePost(Long postId) {
        LambdaUpdateWrapper<ForumPost> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(ForumPost::getId, postId);
        wrapper.setSql("likes = likes + 1");
        return this.update(wrapper);
    }
    
    @Override
    public boolean collectPost(Long postId) {
        LambdaUpdateWrapper<ForumPost> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(ForumPost::getId, postId);
        wrapper.setSql("collects = collects + 1");
        return this.update(wrapper);
    }
} 