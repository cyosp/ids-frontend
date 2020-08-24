package com.cyosp.ids.rest.authentication;

import com.cyosp.ids.rest.LoginPasswordRequest;
import com.cyosp.ids.security.jwt.JwtTokenProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

import static com.cyosp.ids.rest.Rest.REST_PREFIX;
import static org.springframework.http.HttpStatus.OK;
import static org.springframework.security.core.context.SecurityContextHolder.getContext;

@Slf4j
@RestController
@RequestMapping(REST_PREFIX)
public class AuthenticationController {
    public static final String AUTHENTICATE_PATH = "/authenticate";

    private final JwtTokenProvider jwtTokenProvider;

    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    public AuthenticationController(JwtTokenProvider jwtTokenProvider, AuthenticationManagerBuilder authenticationManagerBuilder) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManagerBuilder = authenticationManagerBuilder;
    }

    @PostMapping(AUTHENTICATE_PATH)
    public ResponseEntity<AuthenticationResponse> authorize(@Valid @RequestBody LoginPasswordRequest loginPasswordRequest) {
        UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                new UsernamePasswordAuthenticationToken(loginPasswordRequest.getLogin(), loginPasswordRequest.getPassword());

        Authentication authentication = authenticationManagerBuilder.getObject().authenticate(usernamePasswordAuthenticationToken);
        getContext().setAuthentication(authentication);

        HttpHeaders httpHeaders = new HttpHeaders();
        String jwt = jwtTokenProvider.createToken(authentication);
        httpHeaders.add("Authorization", "Bearer " + jwt);

        return new ResponseEntity<>(new AuthenticationResponse(jwt), httpHeaders, OK);
    }
}
