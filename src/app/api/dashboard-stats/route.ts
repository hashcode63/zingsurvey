import { NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import prisma from '../../../lib/prisma';

export async function GET(request: Request) {
  try {
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const totalResponses = await prisma.surveyResponse.count();
    const payments = await prisma.payment.findMany({ where: { status: 'completed' } });
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const completedSurveys = await prisma.surveyResponse.count({ where: { isCompleted: true } });
    const completionRate = totalResponses > 0 ? (completedSurveys / totalResponses) * 100 : 0;

    const under18Count = await prisma.surveyResponse.count({ where: { age: 'under18' } });
    const over18Count = await prisma.surveyResponse.count({ where: { age: 'over18' } });

    const languageData = await prisma.$queryRaw`
      SELECT language, COUNT(*) as count
      FROM SurveyResponse
      GROUP BY language
      ORDER BY count DESC
      LIMIT 1
    `;
    const topLanguage = languageData[0] || null;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const responsesByDay = await prisma.$queryRaw`
      SELECT DATE(createdAt) as date, COUNT(*) as count
      FROM SurveyResponse
      WHERE createdAt >= ${sevenDaysAgo}
      GROUP BY DATE(createdAt)
      ORDER BY date DESC
    `;

    const ageResult = await prisma.$queryRaw`
      SELECT AVG(CAST(additionalData->>'$.age' AS DECIMAL)) as averageAge
      FROM SurveyResponse
      WHERE JSON_VALID(additionalData) 
      AND JSON_CONTAINS_PATH(additionalData, 'one', '$.age')
    `;
    const averageAge = ageResult[0]?.averageAge || null;

    return NextResponse.json({
      totalResponses,
      totalRevenue,
      completionRate,
      averageAge,
      paymentsReceived: payments.length,
      topLanguage: topLanguage ? {
        name: topLanguage.language,
        count: Number(topLanguage.count),
        percentage: (Number(topLanguage.count) / totalResponses) * 100
      } : null,
      ageDistribution: {
        under18: under18Count,
        over18: over18Count,
        under18Percentage: totalResponses > 0 ? (under18Count / totalResponses) * 100 : 0,
        over18Percentage: totalResponses > 0 ? (over18Count / totalResponses) * 100 : 0
      },
      responsesByDay: responsesByDay.map(day => ({
        date: day.date.toLocaleDateString(),
        count: Number(day.count)
      }))
    });
  } catch (error) {
    console.error('Error in dashboard-stats API route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
