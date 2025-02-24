package com.example.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.project.entity.Bills;
import com.example.project.mapper.BillsMapper;

/**
 * 账单管理Controller
 *
 * @author changyao
 * @date 2025-01-09
 */
@RestController
@RequestMapping("/project/bills")
public class BillsController
{
    @Autowired
    private BillsMapper billsMapper;

    /**
     * 查询账单管理列表
     */
    @GetMapping("/list")
    public List<Bills> list()
    {
        QueryWrapper<Bills> queryWrapper=new QueryWrapper<>();
        return billsMapper.selectList(queryWrapper);
    }


    /**
     * 获取账单管理详细信息
     */
    @PostMapping("/detil")
    public Bills getInfo(@RequestBody Bills bills)
    {
        return billsMapper.selectById(bills);
    }


    /**
     * 新增账单管理
     */
    @PostMapping("/add")
    public int add(@RequestBody Bills bills)
    {
        return billsMapper.insert(bills);
    }

    /**
     * 修改账单管理
     */
    @PostMapping("/edit")
    public int edit(@RequestBody Bills bills)
    {
        return billsMapper.updateById(bills);
    }

    /**
     * 删除账单管理
     */
	@PostMapping("/del")
    public int remove(@RequestBody Bills bills)
    {
        return billsMapper.deleteById(bills);
    }
}
