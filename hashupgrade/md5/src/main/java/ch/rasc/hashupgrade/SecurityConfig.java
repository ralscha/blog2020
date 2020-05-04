package ch.rasc.hashupgrade;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.password.MessageDigestPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
class SecurityConfig extends WebSecurityConfigurerAdapter {

	@Bean
	public PasswordEncoder passwordEncoder() {
		return new MessageDigestPasswordEncoder("MD5");
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		http
		  .authorizeRequests(customizer -> customizer.anyRequest().authenticated())
		  .formLogin(Customizer.withDefaults());
	}

}