/*
 * This file is generated by jOOQ.
 */
package ch.rasc.hashupgrade.db;

import ch.rasc.hashupgrade.db.tables.AppUser;
import ch.rasc.hashupgrade.db.tables.records.AppUserRecord;

import org.jooq.TableField;
import org.jooq.UniqueKey;
import org.jooq.impl.DSL;
import org.jooq.impl.Internal;

/**
 * A class modelling foreign key relationships and constraints of tables in the default
 * schema.
 */
@SuppressWarnings({ "all", "unchecked", "rawtypes" })
public class Keys {

  // -------------------------------------------------------------------------
  // UNIQUE and PRIMARY KEY definitions
  // -------------------------------------------------------------------------

  public static final UniqueKey<AppUserRecord> CONSTRAINT_4 = Internal.createUniqueKey(
      AppUser.APP_USER, DSL.name("CONSTRAINT_4"),
      new TableField[] { AppUser.APP_USER.USER_NAME }, true);
  public static final UniqueKey<AppUserRecord> CONSTRAINT_45 = Internal.createUniqueKey(
      AppUser.APP_USER, DSL.name("CONSTRAINT_45"),
      new TableField[] { AppUser.APP_USER.EMAIL }, true);
  public static final UniqueKey<AppUserRecord> CONSTRAINT_459 = Internal.createUniqueKey(
      AppUser.APP_USER, DSL.name("CONSTRAINT_459"),
      new TableField[] { AppUser.APP_USER.ID }, true);
}
