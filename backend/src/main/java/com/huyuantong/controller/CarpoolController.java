package com.huyuantong.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.huyuantong.common.Result;
import com.huyuantong.entity.Carpool;
import com.huyuantong.service.CarpoolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 拼车控制器
 */
@RestController
@RequestMapping("/carpool")
public class CarpoolController {
    
    @Autowired
    private CarpoolService carpoolService;
    
    /**
     * 获取拼车列表
     */
    @GetMapping("/list")
    public Result<IPage<Carpool>> getCarpoolList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        Page<Carpool> pageParam = new Page<>(page, size);
        IPage<Carpool> carpoolList = carpoolService.page(pageParam);
        return Result.success(carpoolList);
    }
    
    /**
     * 发布拼车信息
     */
    @PostMapping("/publish")
    public Result<String> publishCarpool(@RequestBody Carpool carpool) {
        carpool.setOccupiedSeats(0);
        carpool.setStatus(0);
        boolean success = carpoolService.save(carpool);
        if (success) {
            return Result.success("发布成功");
        } else {
            return Result.error("发布失败");
        }
    }
    
    /**
     * 获取拼车详情
     */
    @GetMapping("/{id}")
    public Result<Carpool> getCarpoolDetail(@PathVariable Long id) {
        Carpool carpool = carpoolService.getById(id);
        if (carpool != null) {
            return Result.success(carpool);
        } else {
            return Result.error("拼车信息不存在");
        }
    }
    
    /**
     * 加入拼车
     */
    @PostMapping("/{id}/join")
    public Result<String> joinCarpool(@PathVariable Long id) {
        boolean success = carpoolService.joinCarpool(id);
        if (success) {
            return Result.success("加入成功");
        } else {
            return Result.error("加入失败");
        }
    }
} 