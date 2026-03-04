import { prisma } from "@/lib/prisma";

const COD_KEY = "payment_cod_enabled";

function hasSettingModel(): boolean {
  return typeof (prisma as { setting?: unknown }).setting !== "undefined";
}

export async function isCodEnabled(): Promise<boolean> {
  try {
    if (!hasSettingModel()) return true;
    const row = await prisma.setting.findUnique({ where: { key: COD_KEY } });
    return row?.value === undefined ? true : row.value === "true";
  } catch {
    return true;
  }
}
