package com.huyuantong.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 二手书实体类
 */
@Data
@TableName("book")
public class Book {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 书名
     */
    private String title;
    
    /**
     * 作者
     */
    private String author;
    
    /**
     * 出版社
     */
    private String publisher;
    
    /**
     * ISBN
     */
    private String isbn;
    
    /**
     * 价格
     */
    private BigDecimal price;
    
    /**
     * 原价
     */
    private BigDecimal originalPrice;
    
    /**
     * 成色 1-全新 2-九成新 3-八成新 4-七成新 5-六成新及以下
     */
    @TableField("`condition`")
    private Integer condition;
    
    /**
     * 图片，多个用逗号分隔
     */
    private String images;
    
    /**
     * 描述
     */
    private String description;
    
    /**
     * 联系方式
     */
    private String contact;
    
    /**
     * 状态 0-待审核 1-在售 2-已售出 3-已下架
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