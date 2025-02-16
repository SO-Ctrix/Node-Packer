import { NextRequest, NextResponse } from 'next/server';
import { PackageJson } from 'type-fest';
import { ExtendedPackageJson } from '@/types/package';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const packageJson = await prisma.packageJson.create({
      data: {
        name: body.name,
        version: body.version,
        description: body.description || '',
        main: body.main || 'index.js',
        type: body.type || 'module',
        license: body.license || 'MIT',
        author: body.author || '',
        isPrivate: body.private || false,
        keywords: JSON.stringify(body.keywords) || '[]',
        categories: JSON.stringify(body.categories) || '[]',
        scripts: JSON.stringify(body.scripts) || '{}',
        dependencies: JSON.stringify(body.dependencies) || '{}',
        packages: JSON.stringify(body.packages) || '{}',
      }
    });

    console.log(packageJson);

    return NextResponse.redirect(`${request.nextUrl.origin}/list`);
  } catch (error) {
    // @ts-expect-error (error in React 19) https://www.reddit.com/r/nextjs/comments/1gkxdqe/typeerror_the_payload_argument_must_be_of_type/m19kxgn/
    console.log('Error creating package.json:', error.stack);
    return NextResponse.json({ error: 'Error creating package.json' }, { status: 500 });
    return NextResponse.json(
      { error: 'Error creating package.json' },
      { status: 500 }
    );
  }
}
