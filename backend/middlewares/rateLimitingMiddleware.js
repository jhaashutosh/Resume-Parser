import { RateLimiterMemory } from "rate-limiter-flexible";
import dotenv from "dotenv";

dotenv.config();

const rateLimiter = new RateLimiterMemory({
  points: process.env.RATE_LIMIT || 1,
  duration: process.env.RATE_DURATION || 60,
});

export const rateLimitingMiddleware = (req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => {
      next();
    })
    .catch(() => {
      res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
    });
};
