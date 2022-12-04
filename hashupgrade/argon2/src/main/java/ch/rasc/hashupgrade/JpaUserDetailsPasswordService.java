package ch.rasc.hashupgrade;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsPasswordService;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionTemplate;

import ch.rasc.hashupgrade.entity.QUser;

@Component
public class JpaUserDetailsPasswordService implements UserDetailsPasswordService {
  private final UserDetailsService userDetailsService;

  private final JPAQueryFactory jpaQueryFactory;

  private final TransactionTemplate transactionTemplate;

  public JpaUserDetailsPasswordService(UserDetailsService userDetailsService,
      JPAQueryFactory jpaQueryFactory, TransactionTemplate transactionTemplate) {
    this.userDetailsService = userDetailsService;
    this.jpaQueryFactory = jpaQueryFactory;
    this.transactionTemplate = transactionTemplate;
  }

  @Override
  public UserDetails updatePassword(UserDetails user, String newPassword) {
    return this.transactionTemplate.execute(state -> {
      JpaUserDetails userDetails = (JpaUserDetails) user;

      this.jpaQueryFactory.update(QUser.user).set(QUser.user.passwordHash, newPassword)
          .where(QUser.user.id.eq(userDetails.getId())).execute();

      return this.userDetailsService.loadUserByUsername(user.getUsername());
    });
  }
}