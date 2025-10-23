package com.huyuantong.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.huyuantong.entity.Carpool;
import com.huyuantong.mapper.CarpoolMapper;
import com.huyuantong.service.CarpoolService;
import org.springframework.stereotype.Service;

/**
 * 拼车服务实现类
 */
@Service
public class CarpoolServiceImpl extends ServiceImpl<CarpoolMapper, Carpool> implements CarpoolService {
    
    @Override
    public boolean joinCarpool(Long carpoolId) {
        Carpool carpool = this.getById(carpoolId);
        if (carpool == null) {
            return false;
        }
        
        // 检查是否还有空位
        if (carpool.getOccupiedSeats() >= carpool.getSeats()) {
            return false;
        }
        
        // 更新已占座位数
        LambdaUpdateWrapper<Carpool> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(Carpool::getId, carpoolId);
        wrapper.setSql("occupied_seats = occupied_seats + 1");
        
        // 如果座位已满，更新状态为拼车中
        if (carpool.getOccupiedSeats() + 1 >= carpool.getSeats()) {
            wrapper.set(Carpool::getStatus, 1);
        }
        
        return this.update(wrapper);
    }
} 