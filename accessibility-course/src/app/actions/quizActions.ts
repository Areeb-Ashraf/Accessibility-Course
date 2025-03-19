'use server';
import { prisma } from '@/lib/prisma';
import { ActionResult } from '@/types';

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

export async function getAllUsersWithXp(): Promise<ActionResult<{ id: string; name: string; totalXp: number }[]>> {
  try {
    // First get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true
      }
    });
    
    // Get all quiz results
    const quizResults = await prisma.quizResult.findMany({
      select: {
        userId: true,
        xpEarned: true
      }
    });
    
    // Calculate total XP for each user
    const usersWithXp = users.map(user => {
      const userResults = quizResults.filter(result => result.userId === user.id);
      const totalXp = userResults.reduce((sum, result) => sum + result.xpEarned, 0);
      
      return {
        id: user.id,
        name: user.name || 'Unnamed User', // Fallback for users without names
        totalXp
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