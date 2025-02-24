package com.example.project.entity;

import java.io.Serializable;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;



/**
 * 预算管理对象 budgets
 *
 * @author changyao
 * @date 2025-01-09
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class Budgets implements Serializable
{
    private static final long serialVersionUID = 1L;
    @TableId(value = "id",type = IdType.AUTO)
    /** 编号 */
    private Long id;

    /** 用户ID */
    private Long userId;

    /** 预算类型 */
    private String type;

    /** 预算金额 */
    private String amount;

    /** 预算开始时间 */
    private String startDate;

    /** 预算结束时间 */
    private String endDate;

}
