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