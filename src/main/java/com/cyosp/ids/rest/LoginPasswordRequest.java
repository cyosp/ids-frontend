package com.cyosp.ids.rest;

import lombok.Data;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class LoginPasswordRequest {
    @Email
    @NotNull
    @Size(max = 50)
    private String login;

    @NotNull
    @Size(min = 8, max = 64)
    private String password;
}
