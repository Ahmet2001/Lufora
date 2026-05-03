export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/current-user";
import { success, unauthorized, error } from "@/lib/api-helpers";
import { completeMilestone } from "@/lib/points";

export async function POST(
  _req: Request,
  { params }: { params: { id: string; milestoneId: string } }
) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  try {
    const result = await completeMilestone(params.milestoneId, user.id);
    return success(result);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to complete milestone";
    return error(message);
  }
}
