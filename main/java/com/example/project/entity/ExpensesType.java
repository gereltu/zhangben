package com.example.project.entity;

import java.io.Serializable;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;



/**
 * 支出类型管理对象 expenses_type
 *
 * @author changyao
 * @date 2025-01-09
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class ExpensesType implements Serializable
{
    private static final long serialVersionUID = 1L;
    @TableId(value = "id",type = IdType.AUTO)
    /** 编号 */
    private Long id;

    /** 消费类型 */
    private String type;

}
