import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const endpoint = process.env.S3_ENDPOINT;
const region = process.env.S3_REGION || "auto";
const accessKeyId = process.env.S3_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || "";
const bucket = process.env.S3_BUCKET || "";
const publicUrl = process.env.S3_PUBLIC_URL || "";

const client = new S3Client({
  region,
  endpoint,
  credentials: { accessKeyId, secretAccessKey },
});

export async function uploadFile({
  key,
  body,
  contentType,
}: {
  key: string;
  body: Buffer;
  contentType: string;
}) {
  if (!bucket) throw new Error("S3_BUCKET missing");

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  if (publicUrl) {
    return `${publicUrl}/${key}`;
  }

  return key;
}
