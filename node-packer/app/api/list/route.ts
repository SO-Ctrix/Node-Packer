import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ExtendedPackageJson } from "@/types/package";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get("search") || "";
        const category = searchParams.get("category") || "";

        // console.log('Received parameters:', { search, category }); // Debug log

        try {
            const packages = await prisma.packageJson.findMany({
                where: {
                    AND: [
                        {
                            OR: [
                                {
                                    name: {
                                        contains: search,
                                    },
                                },
                                {
                                    description: {
                                        contains: search,
                                    },
                                },
                            ],
                        },
                        // Add category filter
                        category ? {
                            categories: {
                                contains: category, // Note: This might need adjustment based on how categories are stored
                            },
                        } : {},
                    ],
                },
                orderBy: {
                    createdAt: "desc",
                },
                // Vous pouvez sélectionner les champs spécifiques si besoin
                select: {
                    id: true,
                    name: true,
                    description: true,
                    version: true,
                    author: true,
                    license: true,
                    keywords: true,
                    categories: true,
                    createdAt: true,
                    packages: true,
                },
            });

            // console.log('Found packages count:', packages.length); // Debug log

            // Conversion des chaînes JSON en objets
            const formattedPackages = packages.map((pkg) => ({
                ...pkg,
                keywords: JSON.parse(pkg.keywords || "[]"),
                categories: JSON.parse(pkg.categories || "[]"),
            }));

            return NextResponse.json(formattedPackages);
        } catch (error) {
            console.error("Error fetching packages:", error);
            return NextResponse.json(
                { error: "Error fetching packages" },
                { status: 500 }
            );
        }

    } catch (error) {
        console.error("Error fetching packages:", error);
        return NextResponse.json(
            { error: "Error fetching packages" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "ID is required" }, { status: 400 });
        }

        await prisma.packageJson.delete({
            where: {
                id: parseInt(id),
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting package:", error);
        return NextResponse.json(
            { error: "Error deleting package" },
            { status: 500 }
        );
    }
}
