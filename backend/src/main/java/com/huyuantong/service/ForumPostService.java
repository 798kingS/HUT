package com.huyuantong.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.huyuantong.entity.ForumPost;

/**
 * 论坛帖子服务接口
 */
public interface ForumPostService extends IService<ForumPost> {
    
    /**
     * 分页查询帖子列表
     */
    IPage<ForumPost> getPostList(Integer page, Integer size, String type);
    
    /**
     * 发布帖子
     */
    boolean publishPost(ForumPost post);
    
    /**
     * 点赞帖子
     */
    boolean likePost(Long postId);
    
    /**
     * 收藏帖子
     */
    boolean collectPost(Long postId);
} 