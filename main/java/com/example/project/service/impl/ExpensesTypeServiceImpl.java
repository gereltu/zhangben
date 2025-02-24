package com.example.project.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import com.example.project.mapper.ExpensesTypeMapper;
import com.example.project.entity.ExpensesType;
import com.example.project.service.IExpensesTypeService;



/**
 * 支出类型管理Service业务层处理
 *
 * @author changyao
 * @date 2025-01-09
 */

@Service
public class ExpensesTypeServiceImpl extends ServiceImpl<ExpensesTypeMapper, ExpensesType> implements IExpensesTypeService {

}

