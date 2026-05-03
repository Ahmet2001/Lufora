export const dynamic = "force-dynamic";

import { getCurrentUser } from "@/lib/current-user";
import { success, unauthorized, error } from "@/lib/api-helpers";
import { moveJourneyToPlant } from "@/lib/points";

export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) return unauthorized();

  try {
    const plant = await moveJourneyToPlant(params.id, user.id);
    return success(plant);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to move to plants";
    return error(message);
  }
}
