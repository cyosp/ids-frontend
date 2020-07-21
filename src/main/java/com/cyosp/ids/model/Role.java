package com.cyosp.ids.model;

import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum Role {
    ADMINISTRATOR("administrator"),
    VIEWER("viewer");

    private final String value;
}
