import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_BUCKET_NAME) {
  throw new Error('Missing required AWS environment variables');
}

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function uploadImage(file: File, userId: string): Promise<string> {
  try {
    const fileExtension = file.name.split('.').pop();
    const key = `profile-pictures/${userId}.${fileExtension}`;

    // Convert File to Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read',
    });

    console.log('Attempting to upload to S3 with params:', {
      bucket: process.env.AWS_BUCKET_NAME,
      key,
      contentType: file.type,
    });

    await s3Client.send(command);
    
    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    console.log('Successfully uploaded image. URL:', imageUrl);
    return imageUrl;
  } catch (error) {
    console.error('Error in uploadImage:', error);
    throw error;
  }
}

export async function deleteImage(userId: string): Promise<void> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `profile-pictures/${userId}`,
    });

    console.log('Attempting to delete from S3 with params:', {
      bucket: process.env.AWS_BUCKET_NAME,
      key: `profile-pictures/${userId}`,
    });

    await s3Client.send(command);
    console.log('Successfully deleted image');
  } catch (error) {
    console.error('Error in deleteImage:', error);
    throw error;
  }
}

export async function getSignedImageUrl(key: string): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    });

    // Generate a signed URL that expires in 1 hour (3600 seconds)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    console.log('Generated signed URL:', signedUrl);
    return signedUrl;
  } catch (error) {
    console.error('Error generating signed URL:', error);
    throw error;
  }
} 