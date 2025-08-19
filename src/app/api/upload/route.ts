import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";
import main from "../../../tools/indexing"
export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const sessionId = cookie;
  
  
  if (!sessionId) {
    return NextResponse.json({ success: false, error: "No session found" }, { status: 403 });
  }


    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    // const fileName = `${sessionId}-${file.name}`;

    const uploadResponse: UploadApiResponse = await new Promise((resolve, reject) => {
  cloudinary.uploader.upload_stream(
    { folder: "pdfs" },
    (error, result) => {
      if (error) reject(error);
      else resolve(result as UploadApiResponse);
    }
  ).end(fileBuffer);
});

    const result = await main(uploadResponse.secure_url);
  return NextResponse.json({
    success: true,
    message: `Upload successful (${req.headers.get("x-upload-count")}/3) ${result} `,
  });
}
