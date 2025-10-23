package com.huyuantong.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.huyuantong.common.Result;
import com.huyuantong.entity.Book;
import com.huyuantong.service.BookService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 二手书控制器
 */
@Slf4j
@RestController
@RequestMapping("/book")
public class BookController {
    
    @Autowired
    private BookService bookService;
    
    /**
     * 获取二手书列表
     */
    @GetMapping("/list")
    public Result<IPage<Book>> getBookList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        
        try {
            log.info("获取二手书列表，页码：{}，每页大小：{}", page, size);
            
            // 参数校验
            if (page < 1) {
                page = 1;
            }
            if (size < 1 || size > 100) {
                size = 10;
            }
            
            Page<Book> pageParam = new Page<>(page, size);
            IPage<Book> bookList = bookService.page(pageParam);
            
            log.info("成功获取二手书列表，总数：{}", bookList.getTotal());
            return Result.success(bookList);
            
        } catch (Exception e) {
            log.error("获取二手书列表失败", e);
            return Result.error("获取二手书列表失败：" + e.getMessage());
        }
    }
    
    /**
     * 发布二手书
     */
    @PostMapping("/publish")
    public Result<String> publishBook(@RequestBody Book book) {
        try {
            log.info("发布二手书：{}", book.getTitle());
            
            // 参数校验
            if (book.getTitle() == null || book.getTitle().trim().isEmpty()) {
                return Result.error("书名不能为空");
            }
            if (book.getPrice() == null || book.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
                return Result.error("价格必须大于0");
            }
            if (book.getContact() == null || book.getContact().trim().isEmpty()) {
                return Result.error("联系方式不能为空");
            }
            
            book.setStatus(1);
            boolean success = bookService.save(book);
            if (success) {
                log.info("二手书发布成功，ID：{}", book.getId());
                return Result.success("发布成功");
            } else {
                return Result.error("发布失败");
            }
        } catch (Exception e) {
            log.error("发布二手书失败", e);
            return Result.error("发布失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取二手书详情
     */
    @GetMapping("/{id}")
    public Result<Book> getBookDetail(@PathVariable Long id) {
        try {
            log.info("获取二手书详情，ID：{}", id);
            
            if (id == null || id <= 0) {
                return Result.error("无效的书籍ID");
            }
            
            Book book = bookService.getById(id);
            if (book != null) {
                log.info("成功获取二手书详情：{}", book.getTitle());
                return Result.success(book);
            } else {
                return Result.error("二手书信息不存在");
            }
        } catch (Exception e) {
            log.error("获取二手书详情失败", e);
            return Result.error("获取二手书详情失败：" + e.getMessage());
        }
    }
    
    /**
     * 购买二手书
     */
    @PostMapping("/{id}/buy")
    public Result<String> buyBook(@PathVariable Long id) {
        try {
            log.info("购买二手书，ID：{}", id);
            
            if (id == null || id <= 0) {
                return Result.error("无效的书籍ID");
            }
            
            boolean success = bookService.buyBook(id);
            if (success) {
                log.info("二手书购买成功，ID：{}", id);
                return Result.success("购买成功");
            } else {
                return Result.error("购买失败，书籍可能已售出或不存在");
            }
        } catch (Exception e) {
            log.error("购买二手书失败", e);
            return Result.error("购买失败：" + e.getMessage());
        }
    }
} 