package com.example.project.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.example.project.entity.Family;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

/**
 * 预算管理Mapper接口
 *
 * @author changyao
 * @date 2025-01-09
 */

public interface FamilyMapper extends BaseMapper<Family> {
    @Select("SELECT COUNT(1) FROM family WHERE invite_code = #{inviteCode}")
    boolean existsByInviteCode(@Param("inviteCode") String inviteCode);

}


