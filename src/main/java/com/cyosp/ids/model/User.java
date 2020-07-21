package com.cyosp.ids.model;

import lombok.Data;

@Data
public class User {
    private String id;

    private String login;

    private String password;

    private Role role;
}
