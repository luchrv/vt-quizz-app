import { config } from "dotenv";
config();

export default {
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost/quizdb",
  PORT: process.env.PORT || 4000,
  SECRET: "mbNTkSXu6DKqU0g52w69JvptmHTLoEEp98bWcmzQwVqa9AY9qL2eb3OlEiydY7Od",
};
