// GET PUT
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ExtendedPackageJson } from '@/types/package';

// Récupérer un package.json spécifique
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const packageJson = await prisma.packageJson.findUnique({
      where: { id }
    });

    if (!packageJson) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }

    
    const deserializedPackage = {
      ...packageJson,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      isPrivate: undefined,
      private: packageJson.isPrivate,
      keywords: JSON.parse(packageJson.keywords),
      categories: JSON.parse(packageJson.categories ?? '[]'),
      scripts: JSON.parse(packageJson.scripts ?? '{}'),
      packages: JSON.parse(packageJson.packages ?? '{}'),
      dependencies: JSON.parse(packageJson.dependencies ?? '{}'),
    }

    console.log(deserializedPackage);

    return NextResponse.json(deserializedPackage);
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json(
      { error: 'Error fetching package' },
      { status: 500 }
    );
  }
}

// Mettre à jour un package.json
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();

    const updatedPackage = await prisma.packageJson.update({
      where: { id },
      data: {
        name: body.name,
        version: body.version,
        description: body.description,
        main: body.main,
        type: body.type,
        license: body.license,
        author: body.author,
        keywords: body.keywords,
        categories: body.categories,
        scripts: body.scripts,
      }
    });

    return NextResponse.json(updatedPackage);
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json(
      { error: 'Error updating package' },
      { status: 500 }
    );
  }
}