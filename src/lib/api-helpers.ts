/**
 * API Response helpers.
 */
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function success(data: unknown, status = 200) {
  return NextResponse.json(data, { status });
}

export function created(data: unknown) {
  return NextResponse.json(data, { status: 201 });
}

export function error(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function notFound(resource = "Resource") {
  return NextResponse.json({ error: `${resource} not found` }, { status: 404 });
}

export function validationError(err: ZodError) {
  return NextResponse.json(
    { error: "Validation failed", details: err.issues },
    { status: 422 }
  );
}
