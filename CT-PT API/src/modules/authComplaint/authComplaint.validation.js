const { z } = require('zod');

const authComplaintSchema = z.object({
  userId: z.string().trim().min(1),
  applId: z.coerce.number().int().positive(),
  ulbId: z.coerce.number().int().positive(),
  mode: z.coerce.number().int().min(1),
  status: z.string().trim().min(1),
  remark: z.string().trim().min(1),
});

module.exports = {
  authComplaintSchema,
};