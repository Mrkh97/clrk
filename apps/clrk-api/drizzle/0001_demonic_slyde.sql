CREATE TABLE "receipt" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"merchant" text NOT NULL,
	"amount" double precision NOT NULL,
	"currency" text DEFAULT 'USD' NOT NULL,
	"date" timestamp NOT NULL,
	"category" text NOT NULL,
	"paymentMethod" text NOT NULL,
	"notes" text,
	"status" text DEFAULT 'complete' NOT NULL,
	"aiExtracted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "receipt" ADD CONSTRAINT "receipt_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "receipt_userId_idx" ON "receipt" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "receipt_userId_date_idx" ON "receipt" USING btree ("userId","date");--> statement-breakpoint
CREATE INDEX "receipt_userId_category_idx" ON "receipt" USING btree ("userId","category");
