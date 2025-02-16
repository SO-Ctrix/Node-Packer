"use client";

import React, { useState, KeyboardEvent, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, X } from 'lucide-react';
import { PackageJson } from 'type-fest';
import { ExtendedPackageJson } from '@/types/package';
import { handleAuthor } from '@/lib/utils';
import DependencyInput from '../components/dependency-input';


interface ValidationErrors {
  name?: string;
  version?: string;
  [key: string]: string | undefined;
}

interface Dependencies {
  [key: number]: {
    name: string;
    version: string;
  }
}

const PackageJsonCreator = () => {
  const [dependencies, setDependencies] = useState<Dependencies>({});
  const [packageData, setPackageData] = useState<ExtendedPackageJson>({
    name: '',
    version: '1.0.0',
    description: '',
    main: 'index.js',
    type: 'module',
    license: 'MIT',
    author: '',
    keywords: [],
    scripts: {
      test: 'echo "Error: no test specified" && exit 1',
      start: 'node index.js'
    },
    categories: [],
    dependencies: {},
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [newTag, setNewTag] = useState<string>('');
  const [newCategory, setNewCategory] = useState<string>('');

  const validateField = (field: string, value: string): string | null => {
    switch (field) {
      case 'name':
        // Vérifie si le nom est valide selon les règles npm
        return /^[a-z0-9-_]+$/.test(value) ? null : 'Le nom doit contenir uniquement des lettres minuscules, chiffres, - et _';
      case 'version':
        // Validation du format semver
        return /^\d+\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+)?$/.test(value) 
          ? null 
          : 'Version invalide (format: x.y.z)';
      default:
        return null;
    }
  };

  const handleInputChange = (field: keyof ExtendedPackageJson, value: string): void => {
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    } as ValidationErrors));

    setPackageData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePrivateChange = (value: string): void => {
    setPackageData(prev => ({
      ...prev,
      private: value === 'yes'
    } as ExtendedPackageJson));
  };

  const handleAddTag = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && newTag.trim()) {
      setPackageData(prev => ({
        ...prev,
        keywords: [...new Set([...(prev.keywords || []), newTag.trim()])]
      } as ExtendedPackageJson));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string): void => {
    setPackageData(prev => ({
      ...prev,
      keywords: prev.keywords?.filter(tag => tag !== tagToRemove) || []
    } as ExtendedPackageJson));
  };

  const handleAddCategory = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && newCategory.trim()) {
      setPackageData(prev => ({
        ...prev,
        categories: [...new Set([...(prev.categories || []), newCategory.trim()])]
      } as ExtendedPackageJson));
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove: string): void => {
    setPackageData(prev => ({
      ...prev,
      categories: prev.categories?.filter(category => category !== categoryToRemove) || []
    } as ExtendedPackageJson));
  };

  const handleSubmit = (): void => {
    console.group('Package Data');
    console.log(errors);
    console.log(packageData);
    console.groupEnd();

    if (hasErrors()) return;
    
    const newErrors: ValidationErrors = {};
    (['name', 'version'] as const).forEach(field => {
      const error = validateField(field, packageData[field] as string);
      if (error) newErrors[field] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    packageData.dependencies = Object.values(dependencies).reduce((acc, dep) => {
      acc[dep.name] = dep.version;
      return acc;
    }, {} as PackageJson.Dependency);

    const formattedJson = JSON.stringify(packageData, null, 2);
    console.log(formattedJson);

    fetch('/api/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: formattedJson,
    })
    .then(res => {
      if (res.redirected) {
        window.location.href = res.url;
        return;
      }
    })
  };

  const hasErrors = (): boolean => {
    return Object.keys(errors).some(field => errors[field] !== null);
  }

  const updateDependency = (index: number, name: string, version: string) => {
    setDependencies(prev => ({
      ...prev,
      [index]: { name, version }
    }));
  };

  const removeDependency = (index: number) => {
    setDependencies(prev => {
      const newDeps = { ...prev };
      delete newDeps[index];
      return newDeps;
    });
  };

  const addDependency = () => {
    const newIndex = Object.keys(dependencies).length;
    setDependencies(prev => ({
      ...prev,
      [newIndex]: { name: '', version: '' }
    }));
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Créer un nouveau package.json</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TooltipProvider>
            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="name">Nom du package</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Le nom doit être unique et respecter les conventions npm</p>
                </TooltipContent>
              </Tooltip>
              <Input
                id="name"
                value={packageData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="mon-projet"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="version">Version</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Format Semantic Versioning (x.y.z)</p>
                </TooltipContent>
              </Tooltip>
              <Input
                id="version"
                value={packageData.version}
                onChange={(e) => handleInputChange('version', e.target.value)}
                placeholder="1.0.0"
                className={errors.version ? 'border-red-500' : ''}
              />
              {errors.version && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.version}</AlertDescription>
                </Alert>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={packageData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Description de votre projet"
              />
            </div>

            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="type">Privé?</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Si votre projet est privé, définissez cette option à Oui</p>
                </TooltipContent>
              </Tooltip>
              <Select 
                value={packageData.private ? 'yes' : 'no'}
                onValueChange={(value) => handlePrivateChange(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Est-ce un package privé?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Oui</SelectItem>
                  <SelectItem value="no">Non</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="type">Type</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>module pour ESM, commonjs pour require()</p>
                </TooltipContent>
              </Tooltip>
              <Select 
                value={packageData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner le type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="module">module</SelectItem>
                  <SelectItem value="commonjs">commonjs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Label htmlFor="license">Licence</Label>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Choisissez la licence qui correspond à votre projet</p>
                </TooltipContent>
              </Tooltip>
              <Select
                value={packageData.license}
                onValueChange={(value) => handleInputChange('license', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner la licence" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MIT">MIT</SelectItem>
                  <SelectItem value="ISC">ISC</SelectItem>
                  <SelectItem value="Apache-2.0">Apache 2.0</SelectItem>
                  <SelectItem value="GPL-3.0">GPL 3.0</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">Auteur</Label>
              <Input
                id="author"
                value={handleAuthor(packageData.author)}
                onChange={(e) => handleInputChange('author', e.target.value)}
                placeholder="Votre nom"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Mots-clés</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {packageData.keywords?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
              <Input
                id="keywords"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Appuyez sur Entrée pour ajouter"
              />
            </div>

            <div className="space-y-4">
              <Label>Dépendances</Label>

              {Object.entries(dependencies).map(([index, { name, version }]) => (
                <DependencyInput
                  key={index}
                  index={Number(index)}
                  name={name}
                  version={version}
                  updateDependencies={updateDependency}
                  onRemove={() => removeDependency(Number(index))}
                />
              ))}
              
              <Button
                type="button"
                variant="outline"
                onClick={addDependency}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Ajouter une dépendance
              </Button>

            </div>

            <div className="space-y-2">
              <Label htmlFor="categories">Catégories</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {packageData.categories.map((category) => (
                  <Badge key={category} variant="outline" className="flex items-center gap-1">
                    {category}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleRemoveCategory(category)}
                    />
                  </Badge>
                ))}
              </div>
              <Input
                id="categories"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                onKeyPress={handleAddCategory}
                placeholder="Appuyez sur Entrée pour ajouter"
              />
            </div>

            <div className="space-y-2">
              {Object.entries(errors).map(([field, message]) => (
                message && (
                  <Alert key={field} variant="destructive">
                    <X className="h-4 w-4" />
                    <AlertDescription>
                      <span className="font-medium capitalize">{field}</span>: {message}
                    </AlertDescription>
                  </Alert>
                )
              ))}
            </div>

            

            <Button 
              className="w-full"
              onClick={handleSubmit}
              disabled={hasErrors()}
            >
              Générer le package.json
            </Button>
          </TooltipProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default PackageJsonCreator;