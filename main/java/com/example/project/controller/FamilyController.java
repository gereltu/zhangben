package com.example.project.controller;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.example.project.DTO.JoinFamilyRequest;
import com.example.project.DTO.LeaveFamilyRequest;
import com.example.project.entity.Family;
import com.example.project.mapper.FamilyMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/project/family")
public class FamilyController {

    @Autowired
    private FamilyMapper familyMapper;


    @GetMapping("/list")
    public List<Family> list() {
        QueryWrapper<Family> queryWrapper = new QueryWrapper<>();
        return familyMapper.selectList(queryWrapper);
    }

    @PostMapping("/joinFamily")
    public Map<String, Object> joinFamily(@RequestBody JoinFamilyRequest request) {
        String inviteCode = request.getInviteCode();
        Long userId = request.getUserId();
        Map<String, Object> response = new HashMap<>();

        // 1. 查询邀请码对应的家庭
        QueryWrapper<Family> query = new QueryWrapper<>();
        query.eq("invite_code", inviteCode);
        Family family = familyMapper.selectOne(query);

        // 2. 邀请码无效直接返回错误
        if (family == null) {
            response.put("code", 404);
            response.put("message", "邀请码无效");
            return response;
        }

        // 3. 检查用户是否已加入
        String memberIds = family.getMemberIds();
        List<Long> memberList = Arrays.stream(memberIds.split("-"))
                .map(Long::parseLong)
                .collect(Collectors.toList());

        if (memberList.contains(userId)) {
            response.put("code", 409);
            response.put("message", "您已加入该家庭");
            return response;
        }

        // 4. 更新成员列表
        String newMemberIds = memberIds.isEmpty() ?
                userId.toString() :
                memberIds + "-" + userId;

        family.setMemberIds(newMemberIds);
        familyMapper.updateById(family);

        response.put("code", 200);
        response.put("message", "加入成功");
        return response;
    }


    @PostMapping("/leaveFamily")
    public Map<String, Object> leaveFamily(@RequestBody LeaveFamilyRequest request) {
        Long userId = request.getUserId();
        Long familyId = request.getFamilyId();
        Map<String, Object> response = new HashMap<>();

        // 1. 查询对应的家庭
        Family family = familyMapper.selectById(familyId);


        // 2. 检查用户是否在成员列表中
        String memberIds = family.getMemberIds();
        List<Long> memberList = Arrays.stream(memberIds.split("-"))
                .map(Long::parseLong)
                .collect(Collectors.toList());

        // 3. 移除用户并处理空家庭
        List<Long> newMemberList = memberList.stream()
                .filter(id -> !id.equals(userId))
                .collect(Collectors.toList());

        if (newMemberList.isEmpty()) {
            // 删除空家庭
            familyMapper.deleteById(familyId);
        } else {
            // 更新成员列表
            String newMemberIds = String.join("-", newMemberList.stream()
                    .map(String::valueOf)
                    .collect(Collectors.toList()));
            family.setMemberIds(newMemberIds);
            familyMapper.updateById(family);
        }

        response.put("code", 200);
        response.put("message", "退出成功");
        return response;
    }



    @PostMapping("/detil")
    public Family getInfo(@RequestBody Family family) {
        return familyMapper.selectById(family);
    }


    @PostMapping("/add")
    public Map<String, Object> add(@RequestBody Family family) {
        // 自动生成唯一邀请码
        String inviteCode;
        do {
            inviteCode = generateRandomCode(6);
        } while (familyMapper.existsByInviteCode(inviteCode)); // 确保唯一性

        family.setInviteCode(inviteCode);
        familyMapper.insert(family);

        return new HashMap<String, Object>(){{
            put("code", 200);
            put("data", family);
        }};
    }

    // 生成随机码（大写字母+数字）
    private String generateRandomCode(int length) {
        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        Random random = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < length; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }


    @PostMapping("/edit")
    public int edit(@RequestBody Family family) {
        return familyMapper.updateById(family);
    }


    @PostMapping("/del")
    public int remove(@RequestBody Family family) {
        return familyMapper.deleteById(family);
    }

}
