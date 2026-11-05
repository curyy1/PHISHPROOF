#!/usr/bin/env bash
# Spins up a throwaway local Postgres, applies the migration + seed, and runs the RLS tests.
# Requires Postgres 15+ binaries on PATH (or PG_BIN). Usage: bash supabase/tests/run-local.sh
set -euo pipefail
PG_BIN="${PG_BIN:-$(dirname "$(command -v pg_ctl || echo /usr/lib/postgresql/16/bin/pg_ctl)")}"
DIR="$(mktemp -d)"
# initdb refuses to run as root; fall back to the postgres OS user when available.
AS=()
if [ "$(id -u)" = "0" ]; then chown postgres "$DIR" && AS=(runuser -u postgres --); fi
PORT="${PORT:-54329}"
cleanup() { "${AS[@]}" "$PG_BIN/pg_ctl" -D "$DIR/data" stop -m fast >/dev/null 2>&1 || true; rm -rf "$DIR"; }
trap cleanup EXIT
"${AS[@]}" "$PG_BIN/initdb" -D "$DIR/data" -U postgres --auth=trust >/dev/null
"${AS[@]}" "$PG_BIN/pg_ctl" -D "$DIR/data" -o "-p $PORT -k $DIR -c listen_addresses=''" -l "$DIR/log" start >/dev/null
PSQL=(psql -h "$DIR" -p "$PORT" -U postgres -d postgres -v ON_ERROR_STOP=1 -q)
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
"${PSQL[@]}" -f "$ROOT/supabase/tests/auth-stub.sql"
for f in "$ROOT"/supabase/migrations/*.sql; do "${PSQL[@]}" -f "$f"; done
"${PSQL[@]}" -f "$ROOT/supabase/seed.sql"
"${PSQL[@]}" -f "$ROOT/supabase/tests/rls.test.sql"
echo "✓ Migrations applied and all RLS tests passed"
