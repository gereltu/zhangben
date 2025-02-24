package com.example.project.entity;

import java.io.Serializable;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * 账单管理对象 bills
 *
 * @author changyao
 * @date 2025-01-09
 */
@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class Bills implements Serializable
{
    private static final long serialVersionUID = 1L;
    @TableId(value = "id",type = IdType.AUTO)
    /** 编号 */
    private Long id;

    /** 用户ID */
    private Long userId;

    /** 账单类型 */
    private String type;

    /** 金额 */
    private String amount;

    /** 账单状态 */
    private String status;

    /** 交易类型 */
    private String tradeType;

    /** 账单记录时间 */
    private String recordDate;


}
