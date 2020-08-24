package com.cyosp.ids.rest.register;

import com.cyosp.ids.model.Role;
import com.cyosp.ids.model.User;
import com.cyosp.ids.repository.UserRepository;
import com.cyosp.ids.rest.LoginPasswordRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Optional;

import static com.cyosp.ids.model.Role.ADMINISTRATOR;
import static com.cyosp.ids.model.Role.VIEWER;
import static com.cyosp.ids.rest.Rest.REST_PREFIX;
import static java.util.UUID.randomUUID;
import static org.springframework.http.HttpStatus.OK;

@Slf4j
@RestController
@RequestMapping(REST_PREFIX)
public class RegisterController {
    public static final String REGISTER_PATH = "/register";

    private final UserRepository userRepository;

    public RegisterController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    ResponseEntity<RegisterResponse> register(LoginPasswordRequest loginPasswordRequest, Role role) {
        User user = User.builder()
                .id(randomUUID().toString())
                .login(loginPasswordRequest.getLogin())
                .password(new BCryptPasswordEncoder().encode(loginPasswordRequest.getPassword()))
                .role(role)
                .build();

        User savedUser = userRepository.save(user);

        return new ResponseEntity<>(RegisterResponse.builder()
                .id(savedUser.getId())
                .build(), OK);
    }

    @PostMapping(REGISTER_PATH + "/admin")
    public ResponseEntity<RegisterResponse> adminRegister(@Valid @RequestBody LoginPasswordRequest loginPasswordRequest) {
        Optional<User> optionalAdminUser = userRepository.findAll().stream()
                .filter(user -> user.getRole() == ADMINISTRATOR)
                .findFirst();
        if (optionalAdminUser.isEmpty()) {
            return register(loginPasswordRequest, ADMINISTRATOR);
        } else
            throw new AuthenticationServiceException("Administrator user already registered");
    }

    @PostMapping(REGISTER_PATH + "/user")
    public ResponseEntity<RegisterResponse> userRegister(@Valid @RequestBody LoginPasswordRequest loginPasswordRequest) {
        return register(loginPasswordRequest, VIEWER);
    }
}
