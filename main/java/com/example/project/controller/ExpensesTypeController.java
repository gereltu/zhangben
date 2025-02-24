package com.example.project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.project.entity.ExpensesType;
import com.example.project.mapper.ExpensesTypeMapper;

/**
 * 支出类型管理Controller
 *
 * @author changyao
 * @date 2025-01-09
 */
@RestController
@RequestMapping("/project/type")
public class ExpensesTypeController
{
    @Autowired
    private ExpensesTypeMapper expensesTypeMapper;

    /**
     * 查询支出类型管理列表
     */
    @GetMapping("/list")
    public List<ExpensesType> list()
    {
        QueryWrapper<ExpensesType> queryWrapper=new QueryWrapper<>();
        return expensesTypeMapper.selectList(queryWrapper);
    }




    /**
     * 获取支出类型管理详细信息
     */
    @PostMapping("/detil")
    public ExpensesType getInfo(@RequestBody ExpensesType expensesType)
    {
        return expensesTypeMapper.selectById(expensesType);
    }


    /**
     * 新增支出类型管理
     */
    @PostMapping("/add")
    public int add(@RequestBody ExpensesType expensesType)
    {
        return expensesTypeMapper.insert(expensesType);
    }

    /**
     * 修改支出类型管理
     */
    @PostMapping("/edit")
    public int edit(@RequestBody ExpensesType expensesType)
    {
        return expensesTypeMapper.updateById(expensesType);
    }

    /**
     * 删除支出类型管理
     */
	@PostMapping("/del")
    public int remove(@RequestBody ExpensesType expensesType)
    {
        return expensesTypeMapper.deleteById(expensesType);
    }
}
