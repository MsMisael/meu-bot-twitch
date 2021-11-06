-- CreateTable
CREATE TABLE "Channel" (
    "user_id" TEXT NOT NULL,
    "user_login" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "enabled" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Channel_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Channel_user_login_key" ON "Channel"("user_login");
