const { z } = require('zod');

const loginSchema = z.object({
  userId: z.string().trim().min(1),
  password: z.string().min(1),
  corpId: z.coerce.number().int().positive().default(1),
  ulbId: z.coerce.number().int().positive().default(1),
  logFlag: z.string().trim().default('Y'),
});

module.exports = {
  loginSchema,
};
