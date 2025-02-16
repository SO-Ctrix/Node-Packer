import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Get total count of packages
        const totalPackages = await prisma.packageJson.count();

        // Get packages created in the last 24 hours
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const thisMonthPackagesCount = await prisma.packageJson.count({
            where: {
                createdAt: {
                    gte: firstDayOfMonth
                }
            }
        });

        const todayPackagesCount = await prisma.packageJson.count({
            where: {
                createdAt: {
                    gte: today
                }
            }
        });

        return NextResponse.json({
            total: totalPackages,
            createdThisMonth: thisMonthPackagesCount,
            createdToday: todayPackagesCount,
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        // @ts-expect-error (error in React 19) https://www.reddit.com/r/nextjs/comments/1gkxdqe/typeerror_the_payload_argument_must_be_of_type/m19kxgn/
        console.error('Stats API Error:', error.stack);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
