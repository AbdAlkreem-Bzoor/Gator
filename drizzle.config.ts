import { defineConfig } from "drizzle-kit";
import {Config, readConfig} from "./src/config.ts";

const config: Config = readConfig();

export default defineConfig({
    schema: "src/lib/db/schema.ts",
    out: "src/lib/db/migrations/",
    dialect: "postgresql",
    dbCredentials: {
        url: config.dbUrl
    }
});