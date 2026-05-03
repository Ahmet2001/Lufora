export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/current-user";
import { success, unauthorized, validationError } from "@/lib/api-helpers";
import { matchmakerSchema } from "@/lib/validations";
import { plantMatchmaker } from "@/lib/ai/mock-ai-service";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  const body = await request.json();
  const parsed = matchmakerSchema.safeParse(body);
  if (!parsed.success) return validationError(parsed.error);

  const result = await plantMatchmaker(parsed.data);
  return success(result);
}
