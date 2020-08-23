package com.cyosp.ids.security.config;

import com.cyosp.ids.security.jwt.JwtAccessDeniedHandler;
import com.cyosp.ids.security.jwt.JwtAuthenticationEntryPoint;
import com.cyosp.ids.security.jwt.JwtConfigurer;
import com.cyosp.ids.security.jwt.JwtTokenProvider;
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static com.cyosp.ids.rest.Rest.REST_PREFIX;
import static com.cyosp.ids.rest.register.RegisterController.REGISTER_PATH;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;


@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final JwtTokenProvider jwtTokenProvider;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;
    private final JwtAccessDeniedHandler jwtAccessDeniedHandler;

    public WebSecurityConfig(JwtTokenProvider jwtTokenProvider,
                             JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint,
                             JwtAccessDeniedHandler jwtAccessDeniedHandler) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
        this.jwtAccessDeniedHandler = jwtAccessDeniedHandler;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .csrf().disable()

                .exceptionHandling()
                .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                .accessDeniedHandler(jwtAccessDeniedHandler)

                .and()
                .headers()
                .frameOptions()
                .sameOrigin()

                .and()
                .sessionManagement()
                .sessionCreationPolicy(STATELESS)

                .and()
                .authorizeRequests()
                .antMatchers(REST_PREFIX + REGISTER_PATH + "/**").permitAll()
                .antMatchers(REST_PREFIX + "/authenticate").permitAll()

                .anyRequest()
                .authenticated()

                .and()
                .apply(securityConfigurerAdapter());
    }

    private JwtConfigurer securityConfigurerAdapter() {
        return new JwtConfigurer(jwtTokenProvider);
    }
}
