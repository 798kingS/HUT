package com.huyuantong.service.impl;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.huyuantong.entity.Book;
import com.huyuantong.mapper.BookMapper;
import com.huyuantong.service.BookService;
import org.springframework.stereotype.Service;

/**
 * 二手书服务实现类
 */
@Service
public class BookServiceImpl extends ServiceImpl<BookMapper, Book> implements BookService {
    
    @Override
    public boolean buyBook(Long bookId) {
        Book book = this.getById(bookId);
        if (book == null) {
            return false;
        }
        
        // 检查是否在售
        if (book.getStatus() != 1) {
            return false;
        }
        
        // 更新状态为已售出
        LambdaUpdateWrapper<Book> wrapper = new LambdaUpdateWrapper<>();
        wrapper.eq(Book::getId, bookId);
        wrapper.set(Book::getStatus, 2);
        
        return this.update(wrapper);
    }
} 