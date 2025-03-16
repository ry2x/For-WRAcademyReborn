CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"level" integer DEFAULT 1 NOT NULL,
	"xp" integer DEFAULT 0 NOT NULL,
	"last_xp_at" timestamp with time zone DEFAULT now() NOT NULL,
	"next_level_xp" integer DEFAULT 100 NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL
);
