package com.huyuantong;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * 湖院通微信小程序后端服务启动类
 */
@SpringBootApplication
@MapperScan("com.huyuantong.mapper")
public class HuyuantongApplication {

    public static void main(String[] args) {
        SpringApplication.run(HuyuantongApplication.class, args);
    }
} 