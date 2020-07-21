package com.cyosp.ids.configuration;

import com.cyosp.ids.model.User;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.io.File;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Component
public class IdsUsersConfiguration {
    private static final String USERS_CONFIGURATION_FILE_NAME = "ids.users.json";

    @Getter
    private List<User> users = new ArrayList<>();

    @PostConstruct
    public void inti() {
        File file = new File(USERS_CONFIGURATION_FILE_NAME);
        if (file.exists()) {
            try {
                users = new ObjectMapper().readValue(file, new TypeReference<>() {
                });
            } catch (Exception e) {
                throw new RuntimeException("Fail to load users configuration file: " + USERS_CONFIGURATION_FILE_NAME + "\n" + e.getMessage());
            }
        } else {
            log.info("Users configuration file doesn't exist: " + USERS_CONFIGURATION_FILE_NAME);
        }
    }
}
