/*
  Warnings:

  - The values [GET_EMAIL_FROM_USER,POST_TWEET,LIKE_TWEET,RETWEET_TWEET,COMMENT_TWEET] on the enum `ActionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActionType_new" AS ENUM ('TIME_IS_X', 'DAY_IS_X_TIME_IS_Y', 'GET_TWEETS_FROM_USER', 'POST_TWEET_FROM_BOT', 'SEND_WHISPERS_TWITCH', 'BLOCK_USER_TWITCH', 'UNBLOCK_USER_TWITCH');
ALTER TABLE "Action" ALTER COLUMN "actionType" TYPE "ActionType_new" USING ("actionType"::text::"ActionType_new");
ALTER TYPE "ActionType" RENAME TO "ActionType_old";
ALTER TYPE "ActionType_new" RENAME TO "ActionType";
DROP TYPE "ActionType_old";
COMMIT;
