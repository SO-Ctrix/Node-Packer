import { PackageJson } from 'type-fest';

export type ExtendedPackageJson = PackageJson & {
  id?: number;
  categories: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type PackageJsonWithMeta = ExtendedPackageJson & {
  id: number;
  createdAt: string;
  updatedAt: string;
};

export type ValidationErrors = {
  [K in keyof PackageJson]?: string;
}

export interface PackageJsonFormProps {
  initialData: ExtendedPackageJson;
  onSubmit: (data: ExtendedPackageJson) => Promise<void>;
  isEditing?: boolean;
  onEditToggle?: () => void;
}
