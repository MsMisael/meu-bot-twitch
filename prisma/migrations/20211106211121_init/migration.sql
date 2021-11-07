-- CreateTable
CREATE TABLE "Hosts" (
    "id" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end" TIMESTAMP(3),
    "channelUser_id" TEXT NOT NULL,

    CONSTRAINT "Hosts_pkey" PRIMARY KEY ("id")
);
