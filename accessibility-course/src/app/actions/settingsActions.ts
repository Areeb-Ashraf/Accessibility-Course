'use server'

import { prisma } from "@/lib/prisma";
import { uploadImage, deleteImage, getSignedImageUrl } from "@/lib/s3";
import { auth } from "@/auth";

export async function updateProfilePicture(file: File) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  try {
    const imageUrl = await uploadImage(file, session.user.id);
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });

    return { success: true, imageUrl };
  } catch (error) {
    console.error('Error updating profile picture:', error);
    throw new Error("Failed to update profile picture");
  }
}

export async function deleteProfilePicture() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  try {
    await deleteImage(session.user.id);
    
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: null },
    });

    return { success: true };
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    throw new Error("Failed to delete profile picture");
  }
}

export async function getUserProfile() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Not authenticated");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      name: true,
      email: true,
      image: true,
    },
  });

  // If the user has an image, get a signed URL
  let imageUrl = user?.image;
  if (imageUrl) {
    try {
      // Extract the key from the image URL
      const urlParts = imageUrl.split('.amazonaws.com/');
      if (urlParts.length > 1) {
        const key = urlParts[1];
        imageUrl = await getSignedImageUrl(key);
      }
    } catch (error) {
      console.error('Error getting signed URL:', error);
      // Fall back to the original URL if there's an error
    }
  }

  return {
    ...user,
    image: imageUrl,
  };
} 