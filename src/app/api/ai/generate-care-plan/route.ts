export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/current-user";
import { success, unauthorized, validationError } from "@/lib/api-helpers";
import { carePlanSchema } from "@/lib/validations";
import { generateCarePlan } from "@/lib/ai/mock-ai-service";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = carePlanSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const result = await generateCarePlan(parsed.data);
  return success(result);
}
