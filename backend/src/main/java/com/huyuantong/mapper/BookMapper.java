package com.huyuantong.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.huyuantong.entity.Book;
import org.apache.ibatis.annotations.Mapper;

/**
 * 二手书Mapper接口
 */
@Mapper
public interface BookMapper extends BaseMapper<Book> {

} 