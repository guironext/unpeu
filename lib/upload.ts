import { writeFile, mkdir } from "fs/promises";
import path from "path";

const UPLOAD_DIR = "public/uploads";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export async function uploadProductImage(
  file: File,
  prefix = "product"
): Promise<string | null> {
  if (!file.size || file.size > MAX_SIZE) return null;
  if (!ALLOWED_TYPES.includes(file.type)) return null;

  const ext = path.extname(file.name) || ".jpg";
  const filename = `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const dir = path.join(process.cwd(), UPLOAD_DIR);
  const filepath = path.join(dir, filename);

  await mkdir(dir, { recursive: true });
  const bytes = await file.arrayBuffer();
  await writeFile(filepath, Buffer.from(bytes));

  return `/uploads/${filename}`;
}
