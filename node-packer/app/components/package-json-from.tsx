'use client';

import React, { useState } from 'react';
import { PackageJson } from 'type-fest';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X } from 'lucide-react';
import { ExtendedPackageJson, PackageJsonFormProps, ValidationErrors } from '@/types/package';

export default function PackageJsonForm({
  initialData,
  onSubmit,
  isEditing = false,
  onEditToggle
}: PackageJsonFormProps) {
  const [packageData, setPackageData] = useState<ExtendedPackageJson>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = (field: keyof ExtendedPackageJson, value: any): string | null => {
    switch (field) {
      case 'name':
        return /^[a-z0-9-_]+$/.test(value) ? null : 'Le nom doit contenir uniquement des lettres minuscules, chiffres, - et _';
      case 'version':
        return /^\d+\.\d+\.\d+(-[0-9A-Za-z-]+(\.[0-9A-Za-z-]+)*)?(\+[0-9A-Za-z-]+)?$/.test(value) 
          ? null 
          : 'Version invalide (format: x.y.z)';
      default:
        return null;
    }
  };

  const handleInputChange = (field: keyof ExtendedPackageJson, value: any) => {
    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    } as Record<string, string>));

    setPackageData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      setPackageData(prev => ({
        ...prev,
        keywords: [...new Set([...prev.keywords || [], newTag.trim()])]
      } as ExtendedPackageJson));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setPackageData(prev => ({
      ...prev,
      keywords: prev.keywords?.filter(tag => tag !== tagToRemove) || []
    } as ExtendedPackageJson));
  };

  const handleAddCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newCategory.trim()) {
      setPackageData(prev => ({
        ...prev,
        categories: [...new Set([...prev.categories, newCategory.trim()])]
      } as ExtendedPackageJson));
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    setPackageData(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category !== categoryToRemove)
    } as ExtendedPackageJson));
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await onSubmit(packageData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>
            {isEditing ? 'Modifier' : 'Détails'} du package.json
          </CardTitle>
          {onEditToggle && (
            <Button 
              onClick={onEditToggle}
              variant={isEditing ? "destructive" : "default"}
            >
              {isEditing ? 'Annuler' : 'Modifier'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="form">
          <TabsList>
            <TabsTrigger value="form">Formulaire</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-4">
            {/* Nom */}
            <div className="space-y-2">
              <Label htmlFor="name">Nom du package</Label>
              <Input
                id="name"
                value={packageData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                disabled={!isEditing}
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.name}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Version */}
            <div className="space-y-2">
              <Label htmlFor="version">Version</Label>
              <Input
                id="version"
                value={packageData.version}
                onChange={(e) => handleInputChange('version', e.target.value)}
                disabled={!isEditing}
                className={errors.version ? 'border-red-500' : ''}
              />
              {errors.version && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.version}</AlertDescription>
                </Alert>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={packageData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={packageData.type as string}
                onValueChange={(value) => handleInputChange('type', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="module">module</SelectItem>
                  <SelectItem value="commonjs">commonjs</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* License */}
            <div className="space-y-2">
              <Label htmlFor="license">Licence</Label>
              <Select
                value={packageData.license as string}
                onValueChange={(value) => handleInputChange('license', value)}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MIT">MIT</SelectItem>
                  <SelectItem value="ISC">ISC</SelectItem>
                  <SelectItem value="Apache-2.0">Apache 2.0</SelectItem>
                  <SelectItem value="GPL-3.0">GPL 3.0</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Keywords */}
            <div className="space-y-2">
              <Label htmlFor="keywords">Mots-clés</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {packageData.keywords?.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    {isEditing && (
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <Input
                  id="keywords"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleAddTag}
                  placeholder="Appuyez sur Entrée pour ajouter"
                />
              )}
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <Label htmlFor="categories">Catégories</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {packageData.categories.map((category) => (
                  <Badge key={category} variant="outline" className="flex items-center gap-1">
                    {category}
                    {isEditing && (
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => handleRemoveCategory(category)}
                      />
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <Input
                  id="categories"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={handleAddCategory}
                  placeholder="Appuyez sur Entrée pour ajouter"
                />
              )}
            </div>

            {isEditing && (
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={isSubmitting || Object.keys(errors).length > 0}
              >
                {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </Button>
            )}
          </TabsContent>

          <TabsContent value="json">
            <Textarea
              value={JSON.stringify(packageData, null, 2)}
              className="font-mono h-96"
              readOnly
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}