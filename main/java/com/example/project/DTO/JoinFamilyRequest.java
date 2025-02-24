package com.example.project.DTO;

public class JoinFamilyRequest {
    private String inviteCode;
    private Long userId;
    // 必须提供 getter/setter


    public String getInviteCode() {
        return inviteCode;
    }

    public void setInviteCode(String inviteCode) {
        this.inviteCode = inviteCode;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}
