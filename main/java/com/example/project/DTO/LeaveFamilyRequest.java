package com.example.project.DTO;

public class LeaveFamilyRequest {
    // 请求体定义
        private Long userId;
        private Long familyId;


    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getFamilyId() {
        return familyId;
    }

    public void setFamilyId(Long familyId) {
        this.familyId = familyId;
    }
}
