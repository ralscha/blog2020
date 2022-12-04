package ch.rasc.hashupgrade;

import java.util.Set;

import org.springframework.security.core.GrantedAuthority;

import ch.rasc.hashupgrade.db.tables.records.AppUserRecord;

public class AppUserDetail {

  private final Long appUserId;

  private final String username;

  private final boolean enabled;

  private final Set<GrantedAuthority> authorities;

  public AppUserDetail(AppUserRecord user) {
    this.appUserId = user.getId();
    this.username = user.getUserName();
    this.authorities = Set.of();
    this.enabled = true;
  }

  public Long getAppUserId() {
    return this.appUserId;
  }

  public String getUsername() {
    return this.username;
  }

  public Set<GrantedAuthority> getAuthorities() {
    return this.authorities;
  }

  public boolean isEnabled() {
    return this.enabled;
  }

}
