package com.example.project.service.impl;


import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import org.springframework.stereotype.Service;

import com.example.project.mapper.BillsMapper;
import com.example.project.entity.Bills;
import com.example.project.service.IBillsService;



/**
 * 账单管理Service业务层处理
 *
 * @author changyao
 * @date 2025-01-09
 */

@Service
public class BillsServiceImpl extends ServiceImpl<BillsMapper, Bills> implements IBillsService {

}

