import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { PackageJson } from "type-fest";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const handleAuthor = (author: PackageJson.Person | undefined): string => {
  if (!author) {
    return '';
  }

  if (typeof author === 'string') {
    return author;
  }

  return `${author.name} <${author.email}>`;
};

