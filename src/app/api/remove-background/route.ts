import { NextRequest } from "next/server";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024;

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.REMOVE_BG_API_KEY;

  if (!apiKey) {
    return jsonError("Remove.bg API key is not configured on the server.", 500);
  }

  const formData = await request.formData();
  const image = formData.get("image");

  if (!(image instanceof File)) {
    return jsonError("Please upload an image file.", 400);
  }

  if (!ACCEPTED_TYPES.includes(image.type)) {
    return jsonError("Unsupported file type. Please upload JPG, PNG, or WEBP.", 400);
  }

  if (image.size > MAX_FILE_SIZE) {
    return jsonError("File is too large. Please upload an image under 10MB.", 413);
  }

  const upstreamFormData = new FormData();
  upstreamFormData.append("image_file", image, image.name);
  upstreamFormData.append("size", "auto");

  try {
    const upstreamResponse = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": apiKey,
      },
      body: upstreamFormData,
      cache: "no-store",
    });

    if (!upstreamResponse.ok) {
      const contentType = upstreamResponse.headers.get("content-type") || "";
      let errorMessage = "Remove.bg failed to process the image.";

      if (contentType.includes("application/json")) {
        const data = (await upstreamResponse.json()) as {
          errors?: Array<{ title?: string }>;
        };
        errorMessage = data.errors?.[0]?.title || errorMessage;
      } else {
        const text = await upstreamResponse.text();
        if (text) errorMessage = text;
      }

      const status = upstreamResponse.status === 402 ? 502 : upstreamResponse.status;
      return jsonError(errorMessage, status);
    }

    const arrayBuffer = await upstreamResponse.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": `inline; filename="${image.name.replace(/\.[^.]+$/, "")}-no-bg.png"`,
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return jsonError("Unable to reach Remove.bg right now. Please try again shortly.", 502);
  }
}
