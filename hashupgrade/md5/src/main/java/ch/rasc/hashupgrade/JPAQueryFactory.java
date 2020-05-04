package ch.rasc.hashupgrade;

import javax.persistence.EntityManager;

import org.springframework.stereotype.Component;

@Component
public class JPAQueryFactory extends com.querydsl.jpa.impl.JPAQueryFactory {

	private final EntityManager entityManager;

	public JPAQueryFactory(EntityManager entityManager) {
		super(entityManager);
		this.entityManager = entityManager;
	}

	public EntityManager getEntityManager() {
		return this.entityManager;
	}

}
