import { NextResponse } from "next/server";
import ImageKit from "imagekit";

// Initialize ImageKit with server-side credentials
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

// This endpoint will be called by the frontend to get an upload signature
export async function GET(request: Request) {
  const result = imagekit.getAuthenticationParameters();
  return NextResponse.json(result);
}
