package com.example.project.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;
import java.io.Serializable;

@Data
@EqualsAndHashCode(callSuper = false)
@Accessors(chain = true)
public class Family implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    /** 编号 */
    private Long id;

    /** 家庭名称 */
    private String familyName;

    /** 创建者ID */
    private Long creatorId;

    /** 加入的用户 */
    private String memberIds;

    /** 邀请码 */
    private String inviteCode;
}
