package com.example.project.controller;

import java.util.List;

import com.example.project.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.project.entity.Budgets;
import com.example.project.mapper.BudgetsMapper;

/**
 * 预算管理Controller
 *
 * @author changyao
 * @date 2025-01-09
 */
@RestController
@RequestMapping("/project/budgets")
public class BudgetsController
{
    @Autowired
    private BudgetsMapper budgetsMapper;

    @Autowired
    private UserMapper userMapper;

    /**
     * 查询预算管理列表
     */
    @GetMapping("/list")
    public List<Budgets> list()
    {
        QueryWrapper<Budgets> queryWrapper=new QueryWrapper<>();
        return budgetsMapper.selectList(queryWrapper);
    }




    /**
     * 获取预算管理详细信息
     */
    @PostMapping("/detil")
    public Budgets getInfo(@RequestBody Budgets budgets)
    {
        return budgetsMapper.selectById(budgets);
    }


    /**
     * 新增预算管理
     */
    @PostMapping("/add")
    public String add(@RequestBody Budgets budgets)
    {
        QueryWrapper<Budgets> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("type",budgets.getType()).eq("user_id",budgets.getUserId());
        List<Budgets> budgetsList = budgetsMapper.selectList(queryWrapper);
        if (!budgetsList.isEmpty()) {
            return "该类型的预算已经存在，无法重复添加！";
        }
        budgetsMapper.insert(budgets);
        return "添加成功！";
    }

    /**
     * 修改预算管理
     */
    @PostMapping("/edit")
    public int edit(@RequestBody Budgets budgets)
    {
        return budgetsMapper.updateById(budgets);
    }

    /**
     * 删除预算管理
     */
	@PostMapping("/del")
    public int remove(@RequestBody Budgets budgets)
    {
        return budgetsMapper.deleteById(budgets);
    }
}
