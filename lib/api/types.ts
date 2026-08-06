export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

export async function unwrap<T>(res: Response): Promise<T> {
  const json = (await res.json()) as ApiResponse<T>;
  if (!json.ok) throw new Error(json.error);
  return json.data;
}
