import QRCode from "qrcode";

const DEVICE_APPROVE_URL = "https://rbtv.bmind.de/device/approve";

function sanitizeUserCode(value: string) {
  return value.replace(/[^0-9A-Z]/g, "").toUpperCase();
}

export async function GET(_request: Request, { userCode }: { userCode: string }) {
  const normalizedUserCode = sanitizeUserCode(userCode);

  if (!normalizedUserCode) {
    return Response.json({ error: "Missing user code" }, { status: 400 });
  }

  const qrCodeSvg = await QRCode.toString(
    `${DEVICE_APPROVE_URL}?user_code=${encodeURIComponent(normalizedUserCode)}`,
    {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 2,
      width: 512,
      color: {
        dark: "#111111",
        light: "#FFFFFF",
      },
    },
  );

  return new Response(qrCodeSvg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
