package ch.rasc.hashupgrade;

import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import ch.rasc.hashupgrade.entity.User;

public class JpaUserDetails implements UserDetails {

	private static final long serialVersionUID = 1L;

	private final long id;

	private final String userName;

	private final String passwordHash;

	public JpaUserDetails(User user) {
		this.id = user.getId();
		this.userName = user.getUserName();
		this.passwordHash = user.getPasswordHash();
	}

	@Override
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return null;
	}

	public long getId() {
		return this.id;
	}

	@Override
	public String getPassword() {
		return this.passwordHash;
	}

	@Override
	public String getUsername() {
		return this.userName;
	}

	@Override
	public boolean isAccountNonExpired() {
		return true;
	}

	@Override
	public boolean isAccountNonLocked() {
		return true;
	}

	@Override
	public boolean isCredentialsNonExpired() {
		return true;
	}

	@Override
	public boolean isEnabled() {
		return true;
	}

}
