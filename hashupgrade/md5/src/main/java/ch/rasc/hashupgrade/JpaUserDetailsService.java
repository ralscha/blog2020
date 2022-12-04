package ch.rasc.hashupgrade;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ch.rasc.hashupgrade.entity.QUser;
import ch.rasc.hashupgrade.entity.User;

@Component
public class JpaUserDetailsService implements UserDetailsService {

  private final JPAQueryFactory jpaQueryFactory;

  public JpaUserDetailsService(JPAQueryFactory jpaQueryFactory) {
    this.jpaQueryFactory = jpaQueryFactory;
  }

  @Override
  @Transactional(readOnly = true)
  public UserDetails loadUserByUsername(String userName)
      throws UsernameNotFoundException {
    User user = this.jpaQueryFactory.selectFrom(QUser.user)
        .where(QUser.user.userName.eq(userName)).fetchFirst();

    if (user != null) {
      return new JpaUserDetails(user);
    }

    throw new UsernameNotFoundException(userName);
  }

}
