// GET & PUT
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { ExtendedPackageJson } from '@/types/package';

// Récupérer un package.json spécifique
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Attendre la résolution des paramètres
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

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
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Attendre la résolution des paramètres
    const resolvedParams = await params;
    const id = parseInt(resolvedParams.id);

    const body = await request.json();

    // Sérialiser les données avant de les sauvegarder
    const serializedData = {
      name: body.name,
      version: body.version,
      description: body.description,
      main: body.main,
      type: body.type,
      license: body.license,
      author: body.author,
      keywords: JSON.stringify(body.keywords || []),
      categories: JSON.stringify(body.categories || []),
      scripts: JSON.stringify(body.scripts || {}),
      packages: JSON.stringify(body.packages || {}),
      dependencies: JSON.stringify(body.dependencies || {})
    };

    const updatedPackage = await prisma.packageJson.update({
      where: { id },
      data: serializedData
    });

    const deserializedPackage = {
      ...updatedPackage,
      keywords: JSON.parse(updatedPackage.keywords || '[]'),
      categories: JSON.parse(updatedPackage.categories || '[]'),
      scripts: JSON.parse(updatedPackage.scripts || '{}'),
      packages: JSON.parse(updatedPackage.packages || '{}'),
      dependencies: JSON.parse(updatedPackage.dependencies || '{}')
    };

    return NextResponse.json(deserializedPackage);
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json(
      { error: 'Error updating package' },
      { status: 500 }
    );
  }
}