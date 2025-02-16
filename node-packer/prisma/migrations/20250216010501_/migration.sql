-- CreateTable
CREATE TABLE "PackageJson" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "version" TEXT NOT NULL,
    "keywords" TEXT NOT NULL,
    "dependencies" TEXT NOT NULL,
    "author" TEXT,
    "license" TEXT NOT NULL,
    "main" TEXT NOT NULL,
    "type" TEXT,
    "categories" TEXT,
    "scripts" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "packages" TEXT NOT NULL
);
