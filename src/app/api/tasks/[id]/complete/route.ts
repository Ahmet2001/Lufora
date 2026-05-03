export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/current-user";
import { success, unauthorized, error } from "@/lib/api-helpers";
import { completeTask } from "@/lib/points";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  try {
    const result = await completeTask(params.id, user.id);
    return success(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to complete task";
    return error(message);
  }
}
