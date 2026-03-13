package com.urbanblack.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String phoneNumber;
    private String password;
}
