require("dotenv").config();

const { z } = require("zod");

const envSchema = z.object({
    NODE_ENV : z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('5000'),
    MONGODB_URI : z.string().min(1, 'Database connection string is required'),
    JWT_SECRET : z.string().min(1, 'JWT secret is required'),
    JWT_EXPIRES_IN: z.string().default('7d'),
})

const result = envSchema.safeParse(process.env);

if(!result.success){
    console.error('Invalid environment variables:', JSON.stringify(result.error.format(), null, 2));
    process.exit(1);
}

module.exports = { env: result.data };