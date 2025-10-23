package com.huyuantong.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.huyuantong.entity.Book;

/**
 * 二手书服务接口
 */
public interface BookService extends IService<Book> {
    
    /**
     * 购买二手书
     */
    boolean buyBook(Long bookId);
} 