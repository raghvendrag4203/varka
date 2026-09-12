import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
    PORT: z
        .string()
        .regex(/^\d+$/, {
            error: 'Only numbers are allowed !',
        })
        .transform((val) => parseInt(val, 10))
        .refine((val) => val > 0 && val <= 65535, {  // ✅ fixed typo
            error: 'Port number must be in range (0, 65535]',
        }),

    MONGODB_URI: z
        .string()
        .trim()
        .min(1, {
            error: 'MONGODB_URI cannot be empty !',
        })
        .regex(
            /^mongodb(?:\+srv)?:\/\/(?:(?:[^:]+):(?:[^@]+)@)?(?:(?:[a-zA-Z0-9.-]+)(?::\d+)?(?:,[a-zA-Z0-9.-]+(?::\d+)?)*)(?:\/[^?#]*)?(?:\?[^#]*)?$/,
            {
                error: 'Invalid MongoDB connection string format',
            },
        ),

    SALT_ROUNDS: z
        .string()
        .regex(/^\d+$/, {
            error: 'Only numbers are allowed !',
        })
        .transform((val) => parseInt(val, 10))
        .pipe(
            z
                .number()
                .gte(5, {
                    error: 'Salt must be greater than equal to 5',
                })
                .lt(12, {
                    error: 'Salt must be less than 12',
                }),
        ),

    ACCESS_TOKEN_SECRET: z
        .string()
        .trim(),

    ACCESS_TOKEN_EXPIRY: z
        .string()
        .trim()
        .regex(/^\d+[smhd]$/, {
            error: 'ACCESS_TOKEN_EXPIRY must be in format like 15m, 2h, 1d, 30s',
        }),

    BREVO_API_KEY: z
        .string()
        .trim()
        .regex(/^xkeysib-[a-zA-Z0-9]+-[a-zA-Z0-9]+$/, {
            error: 'Invalid Brevo API key format — expected xkeysib-<key>-<suffix>',
        }),

    SENDER_EMAIL: z
        .string()
        .trim()
        .email({
            error: 'Invalid sender email address',
        }),

    SENDER_NAME: z
        .string()
        .trim()
        .min(1, {
            error: 'SENDER_NAME cannot be empty !',
        }),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
    console.error('ERROR parsing the environment variables : ', parsedEnv.error.flatten())
    process.exit(1)
}

const config = {
    port: parsedEnv.data.PORT,
    mongodbUri: parsedEnv.data.MONGODB_URI,
    saltRounds: parsedEnv.data.SALT_ROUNDS,
    accessTokenSecret: parsedEnv.data.ACCESS_TOKEN_SECRET,
    accessTokenExpiry: parsedEnv.data.ACCESS_TOKEN_EXPIRY,
    brevoApiKey: parsedEnv.data.BREVO_API_KEY,
    senderEmail: parsedEnv.data.SENDER_EMAIL,
    senderName: parsedEnv.data.SENDER_NAME,
} as const

export default config