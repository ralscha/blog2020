Code for blog post: https://blog.rasc.ch/2020/05/passwordhashupgrade.html

## Upgrading MariaDB 10.10 to 13.0

Before recreating the existing `db` container, stop application writers and
export the `demo` database with routines, triggers and events. For example, from
the running old container (the demo credentials below are local examples):

```sh
docker compose exec db sh -c 'mariadb-dump -uroot -p"$MARIADB_ROOT_PASSWORD" --single-transaction --hex-blob --routines --events --triggers --databases demo > /tmp/demo-before-upgrade.sql'
docker compose cp db:/tmp/demo-before-upgrade.sql ./demo-before-upgrade.sql
```

The old Compose definition did not name its data volume. Record that volume
with `docker inspect` and retain it for rollback. Validate the dump in a separate
instance before proceeding. Create the new MariaDB 13 service with an empty
named volume, copy the dump into it, and import it:

```sh
docker compose cp ./demo-before-upgrade.sql db:/tmp/demo-before-upgrade.sql
docker compose exec db sh -c 'mariadb -uroot -p"$MARIADB_ROOT_PASSWORD" < /tmp/demo-before-upgrade.sql'
```

Verify user/table counts, existing password hashes, and the login/hash-upgrade
flows before restarting writers. Restore application databases only; do not
overwrite MariaDB 13 system tables with a dump of MariaDB 10's `mysql` database.
The dump uses `--hex-blob` to preserve binary password hashes across text tools
and character encodings. This migration uses a fresh data directory; do not
point MariaDB 13 directly at the old MariaDB 10 directory.

Rollback uses the retained old volume or the pre-upgrade dump with MariaDB 10;
do not downgrade binaries against the upgraded data files. See the
[MariaDB major-version upgrade guide](https://mariadb.com/docs/server/server-management/install-and-upgrade-mariadb/upgrading/upgrading-between-major-mariadb-versions).
