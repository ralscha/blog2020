package ch.rasc.hashupgrade;

import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
class SecurityConfig {

  @Bean
  public PasswordEncoder passwordEncoder() {
    MessageDigestPasswordEncoder md5PE = new MessageDigestPasswordEncoder("MD5");

    Argon2PasswordEncoder argon2PE = new Argon2PasswordEncoder(16, 32, 1, 1 << 17, 10);

    Map<String, PasswordEncoder> encoders = Map.of("argon2", argon2PE);

    DelegatingPasswordEncoder delegatingPasswordEncoder = new DelegatingPasswordEncoder(
        "argon2", encoders);
    delegatingPasswordEncoder.setDefaultPasswordEncoderForMatches(md5PE);
    return delegatingPasswordEncoder;
  }

  /*
   * @Bean public PasswordEncoder passwordEncoder() { MessageDigestPasswordEncoder md5PE =
   * new MessageDigestPasswordEncoder("MD5");
   *
   * Argon2PasswordEncoder argon2PE = new Argon2PasswordEncoder(16, 32, 1, 1 << 18, 11);
   *
   * Map<String, PasswordEncoder> encoders = Map.of("argon2", argon2PE);
   *
   * DelegatingPasswordEncoder delegatingPasswordEncoder = new DelegatingPasswordEncoder(
   * "argon2", encoders);
   * delegatingPasswordEncoder.setDefaultPasswordEncoderForMatches(md5PE); return
   * delegatingPasswordEncoder; }
   */

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    return http
        .authorizeHttpRequests(customizer -> customizer.anyRequest().authenticated())
        .formLogin(Customizer.withDefaults()).build();
  }

}