package com.huyuantong.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.huyuantong.entity.Carpool;

/**
 * 拼车服务接口
 */
public interface CarpoolService extends IService<Carpool> {
    
    /**
     * 加入拼车
     */
    boolean joinCarpool(Long carpoolId);
} 