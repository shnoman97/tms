import { SQLDatabase } from "encore.dev/storage/sqldb";

export const db = new SQLDatabase("tms_db", {
    migrations: "./migrations",
});
