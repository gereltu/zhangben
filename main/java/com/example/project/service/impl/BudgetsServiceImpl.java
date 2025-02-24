package com.example.project.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import com.example.project.mapper.BudgetsMapper;
import com.example.project.entity.Budgets;
import com.example.project.service.IBudgetsService;



/**
 * 预算管理Service业务层处理
 *
 * @author changyao
 * @date 2025-01-09
 */

@Service
public class BudgetsServiceImpl extends ServiceImpl<BudgetsMapper, Budgets> implements IBudgetsService {

}

