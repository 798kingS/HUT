package com.huyuantong.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.huyuantong.common.Result;
import com.huyuantong.entity.ForumPost;
import com.huyuantong.service.ForumPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 论坛控制器
 */
@RestController
@RequestMapping("/forum")
public class ForumController {
    
    @Autowired
    private ForumPostService forumPostService;
    
    /**
     * 获取帖子列表
     */
    @GetMapping("/posts")
    public Result<IPage<ForumPost>> getPostList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "all") String type) {
        
        IPage<ForumPost> postList = forumPostService.getPostList(page, size, type);
        return Result.success(postList);
    }
    
    /**
     * 发布帖子
     */
    @PostMapping("/post")
    public Result<String> publishPost(@RequestBody ForumPost post) {
        boolean success = forumPostService.publishPost(post);
        if (success) {
            return Result.success("发布成功");
        } else {
            return Result.error("发布失败");
        }
    }
    
    /**
     * 点赞帖子
     */
    @PostMapping("/post/{id}/like")
    public Result<String> likePost(@PathVariable Long id) {
        boolean success = forumPostService.likePost(id);
        if (success) {
            return Result.success("点赞成功");
        } else {
            return Result.error("点赞失败");
        }
    }
    
    /**
     * 收藏帖子
     */
    @PostMapping("/post/{id}/collect")
    public Result<String> collectPost(@PathVariable Long id) {
        boolean success = forumPostService.collectPost(id);
        if (success) {
            return Result.success("收藏成功");
        } else {
            return Result.error("收藏失败");
        }
    }
    
    /**
     * 获取帖子详情
     */
    @GetMapping("/post/{id}")
    public Result<ForumPost> getPostDetail(@PathVariable Long id) {
        ForumPost post = forumPostService.getById(id);
        if (post != null) {
            return Result.success(post);
        } else {
            return Result.error("帖子不存在");
        }
    }
} 