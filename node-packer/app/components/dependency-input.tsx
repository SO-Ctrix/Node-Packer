import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface DependencyInputProps {
  index: number;
  name: string;
  version: string;
  updateDependencies: (index: number, name: string, version: string) => void;
  onRemove?: () => void;
  className?: string;
}

const DependencyInput: React.FC<DependencyInputProps> = ({
  index,
  name,
  version,
  updateDependencies,
  onRemove,
  className = "",
}) => {
  return (
    <div className={`flex items-end gap-2 ${className}`}>
      <div className="flex-1">
        <Label htmlFor={`package-name-${index}`}>Nom du package</Label>
        <Input
          id={`package-name-${index}`}
          value={name}
          onChange={(e) => updateDependencies(index, e.target.value, version)}
          placeholder="ex: react"
          className="mt-1"
        />
      </div>

      <div className="flex-1">
        <Label htmlFor={`package-version-${index}`}>Version</Label>
        <Input
          id={`package-version-${index}`}
          value={version}
          onChange={(e) => updateDependencies(index, name, e.target.value)}
          placeholder="ex: ^18.0.0"
          className="mt-1"
          pattern="^(\^|~|>=|<=|>|<|=)?\d+\.\d+\.\d+(-[a-zA-Z0-9.]+)?$"
        />
      </div>

      {onRemove && (
        <button
          onClick={onRemove}
          className="p-2 hover:bg-gray-100 rounded"
          type="button"
          aria-label="Supprimer la dépendance"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default DependencyInput;
