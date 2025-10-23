package com.huyuantong.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 拼车实体类
 */
@Data
@TableName("carpool")
public class Carpool {
    
    @TableId(type = IdType.AUTO)
    private Long id;
    
    /**
     * 用户ID
     */
    private Long userId;
    
    /**
     * 出发地
     */
    private String startLocation;
    
    /**
     * 目的地
     */
    private String endLocation;
    
    /**
     * 出发时间
     */
    private LocalDateTime departureTime;
    
    /**
     * 座位数
     */
    private Integer seats;
    
    /**
     * 已占座位数
     */
    private Integer occupiedSeats;
    
    /**
     * 价格
     */
    private BigDecimal price;
    
    /**
     * 联系方式
     */
    private String contact;
    
    /**
     * 备注
     */
    private String remark;
    
    /**
     * 状态 0-待拼车 1-拼车中 2-已完成 3-已取消
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