package com.huyuantong.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 论坛帖子实体类
 */
@Data
@TableName("forum_post")
public class ForumPost {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 标题
     */
    private String title;
    
    /**
     * 内容
     */
    private String content;
    
    /**
     * 图片，多个用逗号分隔
     */
    private String images;
    
    /**
     * 标签
     */
    private String tag;
    
    /**
     * 点赞数
     */
    private Integer likes;
    
    /**
     * 收藏数
     */
    private Integer collects;
    
    /**
     * 评论数
     */
    private Integer comments;
    
    /**
     * 浏览量
     */
    private Integer views;
    
    /**
     * 是否精华 0-否 1-是
     */
    private Integer isEssence;
    
    /**
     * 状态 0-待审核 1-正常 2-已删除
     */
    private Integer status;
    
    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    
    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
    
    /**
     * 逻辑删除 0-未删除 1-已删除
     */
    @TableLogic
    private Integer deleted;
} 