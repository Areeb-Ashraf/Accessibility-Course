'use server';
import { prisma } from '@/lib/prisma';
import { ActionResult } from '@/types';

// Level calculation utility function
export async function calculateLevelFromXp(xp: number): Promise<number> {
  if (xp >= 500) return 4;
  if (xp >= 150) return 3;
  if (xp >= 25) return 2;
  return 0;
}

// Calculate XP needed for next level
export async function xpNeededForNextLevel(xp: number): Promise<number | null> {
  if (xp >= 500) return null; // Already at max level
  if (xp >= 150) return 500 - xp; // Need to reach 500 for level 4
  if (xp >= 25) return 150 - xp; // Need to reach 150 for level 3
  return 25 - xp; // Need to reach 25 for level 2
}

// Get user's next uncompleted quizzes
export async function getNextTodoQuizzes(userId: string): Promise<ActionResult<{quizId: string, title: string, section: string}[]>> {
  try {
    // Define all quizzes in order
    const allQuizzes = [
      { quizId: "1.1 Text Alternatives", title: "Text Alternatives", section: "1 Perceivable" },
      { quizId: "1.2 Adaptable Content", title: "Adaptable Content", section: "1 Perceivable" },
      { quizId: "2.1 Keyboard Accessibility", title: "Keyboard Accessibility", section: "2 Operable" },
      { quizId: "2.2 Sufficient Time", title: "Sufficient Time", section: "2 Operable" },
      { quizId: "2.3 Seizures and Physical Reactions", title: "Seizures and Physical Reactions", section: "2 Operable" },
      { quizId: "3.1 Readable Content", title: "Readable Content", section: "3 Understandable" },
      { quizId: "3.2 Predictable Behavior", title: "Predictable Behavior", section: "3 Understandable" },
      { quizId: "3.3 Input Assistance", title: "Input Assistance", section: "3 Understandable" },
      { quizId: "4.1 Compatible Technologies", title: "Compatible Technologies", section: "4 Robust" },
      { quizId: "4.2 Future Compatibility", title: "Future Compatibility", section: "4 Robust" }
    ];
    
    // Get the user's completed quizzes
    const completedQuizzes = await prisma.quizResult.findMany({
      where: { userId },
      select: { quizId: true }
    });
    
    const completedQuizIds = completedQuizzes.map(q => q.quizId);
    
    // Filter to get uncompleted quizzes
    const uncompletedQuizzes = allQuizzes.filter(quiz => !completedQuizIds.includes(quiz.quizId));
    
    // Return the next 2 uncompleted quizzes, or fewer if less than 2 are left
    return { 
      status: 'success', 
      data: uncompletedQuizzes.slice(0, 2)
    };
  } catch (error) {
    console.error("Failed to get next todo quizzes:", error);
    return { status: 'error', error: 'Failed to get next todo quizzes' };
  }
}

// Get user's progress for each curriculum section
export async function getSectionProgress(userId: string): Promise<ActionResult<{[sectionId: string]: number}>> {
  try {
    // Define the sections and their quizzes
    const sections = [
      { id: '1', title: 'Perceivable', quizzes: ["1.1 Text Alternatives", "1.2 Adaptable Content"] },
      { id: '2', title: 'Operable', quizzes: ["2.1 Keyboard Accessibility", "2.2 Sufficient Time", "2.3 Seizures and Physical Reactions"] },
      { id: '3', title: 'Understandable', quizzes: ["3.1 Readable Content", "3.2 Predictable Behavior", "3.3 Input Assistance"] },
      { id: '4', title: 'Robust', quizzes: ["4.1 Compatible Technologies", "4.2 Future Compatibility"] }
    ];
    
    // Get the user's completed quizzes
    const completedQuizzes = await prisma.quizResult.findMany({
      where: { userId },
      select: { quizId: true }
    });
    
    const completedQuizIds = completedQuizzes.map(q => q.quizId);
    
    // Calculate progress for each section
    const progress: {[sectionId: string]: number} = {};
    
    sections.forEach(section => {
      const totalQuizzes = section.quizzes.length;
      if (totalQuizzes === 0) {
        progress[section.id] = 0;
        return;
      }
      
      const completedCount = section.quizzes.filter(q => completedQuizIds.includes(q)).length;
      progress[section.id] = Math.round((completedCount / totalQuizzes) * 100);
    });
    
    return { status: 'success', data: progress };
  } catch (error) {
    console.error("Failed to get section progress:", error);
    return { status: 'error', error: 'Failed to get section progress' };
  }
}

export async function saveQuizResult(
  userId: string,
  quizId: string,
  score: number,
  xpEarned: number
): Promise<ActionResult<object>> {
  try {
    // Calculate score percentage (0-100)
    const scorePercentage = score;
    
    // Check if a result already exists for this user and quiz
    const existingResult = await prisma.quizResult.findUnique({
      where: {
        userId_quizId: {
          userId,
          quizId
        }
      }
    });
    
    if (existingResult) {
      // Only update if new score or XP is higher
      if (scorePercentage > existingResult.score || xpEarned > existingResult.xpEarned) {
        const updatedResult = await prisma.quizResult.update({
          where: {
            userId_quizId: {
              userId,
              quizId
            }
          },
          data: {
            score: scorePercentage > existingResult.score ? scorePercentage : existingResult.score,
            xpEarned: xpEarned > existingResult.xpEarned ? xpEarned : existingResult.xpEarned,
            completedAt: new Date()
          }
        });
        return { status: 'success', data: updatedResult };
      }
      return { status: 'success', data: existingResult };
    } else {
      // Create new result
      const newResult = await prisma.quizResult.create({
        data: {
          userId,
          quizId,
          score: scorePercentage,
          xpEarned,
          completedAt: new Date()
        }
      });
      return { status: 'success', data: newResult };
    }
  } catch (error) {
    console.error("Failed to save quiz result:", error);
    return { status: 'error', error: 'Failed to save quiz result' };
  }
}

export async function getUserQuizResults(userId: string): Promise<ActionResult<object>> {
  try {
    const results = await prisma.quizResult.findMany({
      where: {
        userId
      },
      orderBy: {
        quizId: 'asc'
      }
    });
    
    return { status: 'success', data: results };
  } catch (error) {
    console.error("Failed to get quiz results:", error);
    return { status: 'error', error: 'Failed to get quiz results' };
  }
}

export async function getTotalUserXp(userId: string): Promise<ActionResult<number>> {
  try {
    const results = await prisma.quizResult.findMany({
      where: {
        userId
      },
      select: {
        xpEarned: true
      }
    });
    
    const totalXp = results.reduce((sum, result) => sum + result.xpEarned, 0);
    
    return { status: 'success', data: totalXp };
  } catch (error) {
    console.error("Failed to get total XP:", error);
    return { status: 'error', error: 'Failed to get total XP' };
  }
}

export async function getAllUsersWithXp(): Promise<ActionResult<{ id: string; name: string; totalXp: number; image?: string | null }[]>> {
  try {
    // First get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true
      }
    });
    
    // Get all quiz results
    const quizResults = await prisma.quizResult.findMany({
      select: {
        userId: true,
        xpEarned: true
      }
    });
    
    // Process image URLs if needed
    const usersWithProcessedImages = await Promise.all(
      users.map(async (user) => {
        let imageUrl = user.image;
        
        // If the user has an image stored, get a signed URL
        if (imageUrl) {
          try {
            // Extract the key from the image URL
            const urlParts = imageUrl.split('.amazonaws.com/');
            if (urlParts.length > 1) {
              const key = urlParts[1];
              
              // Import here to avoid reference errors
              const { getSignedImageUrl } = await import('@/lib/s3');
              imageUrl = await getSignedImageUrl(key);
            }
          } catch (error) {
            console.error('Error getting signed URL:', error);
            // Fall back to the original URL if there's an error
          }
        }
        
        return {
          ...user,
          image: imageUrl
        };
      })
    );
    
    // Calculate total XP for each user
    const usersWithXp = usersWithProcessedImages.map(user => {
      const userResults = quizResults.filter(result => result.userId === user.id);
      const totalXp = userResults.reduce((sum, result) => sum + result.xpEarned, 0);
      
      return {
        id: user.id,
        name: user.name || 'Unnamed User', // Fallback for users without names
        totalXp,
        image: user.image
      };
    });
    
    // Sort by XP in descending order
    usersWithXp.sort((a, b) => b.totalXp - a.totalXp);
    
    return { status: 'success', data: usersWithXp };
  } catch (error) {
    console.error("Failed to get users with XP:", error);
    return { status: 'error', error: 'Failed to get users with XP' };
  }
}

export async function getUserInfoWithXp(userId: string): Promise<ActionResult<{ id: string; name: string; totalXp: number }>> {
  try {
    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true
      }
    });
    
    if (!user) {
      return { status: 'error', error: 'User not found' };
    }
    
    // Get user's quiz results
    const quizResults = await prisma.quizResult.findMany({
      where: {
        userId
      },
      select: {
        xpEarned: true
      }
    });
    
    // Calculate total XP
    const totalXp = quizResults.reduce((sum, result) => sum + result.xpEarned, 0);
    
    return { 
      status: 'success', 
      data: {
        id: user.id,
        name: user.name || 'Unnamed User',
        totalXp
      } 
    };
  } catch (error) {
    console.error("Failed to get user info with XP:", error);
    return { status: 'error', error: 'Failed to get user info with XP' };
  }
}

// Get XP earned by section for chart display
export async function getSectionXpData(userId: string): Promise<ActionResult<{[sectionTitle: string]: number}>> {
  try {
    // Define the sections and their quizzes
    const sections = [
      { id: '1', title: 'Perceivable', quizzes: ["1.1 Text Alternatives", "1.2 Adaptable Content"] },
      { id: '2', title: 'Operable', quizzes: ["2.1 Keyboard Accessibility", "2.2 Sufficient Time", "2.3 Seizures and Physical Reactions"] },
      { id: '3', title: 'Understandable', quizzes: ["3.1 Readable Content", "3.2 Predictable Behavior", "3.3 Input Assistance"] },
      { id: '4', title: 'Robust', quizzes: ["4.1 Compatible Technologies", "4.2 Future Compatibility"] }
    ];
    
    // Get the user's quiz results
    const quizResults = await prisma.quizResult.findMany({
      where: { userId },
      select: { quizId: true, xpEarned: true }
    });
    
    // Calculate total XP for each section
    const sectionXp: {[sectionTitle: string]: number} = {
      'Perceivable': 0,
      'Operable': 0,
      'Understandable': 0,
      'Robust': 0
    };
    
    sections.forEach(section => {
      quizResults.forEach(result => {
        if (section.quizzes.includes(result.quizId)) {
          sectionXp[section.title] += result.xpEarned;
        }
      });
    });
    
    return { status: 'success', data: sectionXp };
  } catch (error) {
    console.error("Failed to get section XP data:", error);
    return { status: 'error', error: 'Failed to get section XP data' };
  }
}