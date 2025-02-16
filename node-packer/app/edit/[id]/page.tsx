'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PackageJson } from 'type-fest';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { ExtendedPackageJson } from '@/types/package';

export default function EditPackageJson({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('form');
  const [packageData, setPackageData] = useState<ExtendedPackageJson | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState('');
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    fetchPackageData();
  }, [params.id]);

  const fetchPackageData = async () => {
    try {
      const response = await fetch(`/api/${params.id}`);
      if (!response.ok) throw new Error('Package not found');
      
      const data = await response.json();
      console.log(data);
      setPackageData(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la récupération du package');
      router.push('/list');
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!packageData) return;

    const error = validateField(field, value);
    setErrors(prev => ({
      ...prev,
      [field]: error
    } as Record<string, string>));

    setPackageData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleJSONEdit = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      setPackageData(prev => ({
        ...prev,
        ...parsed
      }));
      setErrors({});
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        json: 'JSON invalide'
      }));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim() && packageData) {
      setPackageData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          keywords: [...new Set([...prev.keywords || [], newTag.trim()])]
        } as ExtendedPackageJson;
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    if (!packageData) return;
    setPackageData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        keywords: prev.keywords?.filter(tag => tag !== tagToRemove) || []
      } as ExtendedPackageJson;
    });
  };

  const handleAddCategory = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newCategory.trim() && packageData) {
      setPackageData(prev => {
        if (!prev) return null;
        return {
          ...prev,
          categories: [...new Set([...prev.categories, newCategory.trim()])]
        } as ExtendedPackageJson;
      });
      setNewCategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove: string) => {
    if (!packageData) return;
    setPackageData(prev => {
      if (!prev) return null;
      return {
        ...prev,
        categories: prev.categories.filter(category => category !== categoryToRemove)
      } as ExtendedPackageJson;
    });
  };

  const handleSave = async () => {
    if (!packageData) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packageData),
      });

      if (!response.ok) throw new Error('Failed to update package');

      toast.success('Package.json mis à jour avec succès');
      router.push('/list');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la mise à jour du package');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">Chargement...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">Package non trouvé</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => router.push('/list')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <CardTitle>Modifier le package.json</CardTitle>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="form">Formulaire</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>

            <TabsContent value="form" className="space-y-4">
              {/* Form fields - Similar to create page */}
              <div className="space-y-2">
                <Label htmlFor="name">Nom du package</Label>
                <Input
                  id="name"
                  value={packageData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.name}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">Version</Label>
                <Input
                  id="version"
                  value={packageData.version}
                  onChange={(e) => handleInputChange('version', e.target.value)}
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
                />
              </div>

              {/* Other fields similar to create page */}
            </TabsContent>

            <TabsContent value="json">
              <Textarea
                value={JSON.stringify(packageData, null, 2)}
                onChange={(e) => handleJSONEdit(e.target.value)}
                className="font-mono h-[600px]"
              />
              {errors.json && (
                <Alert variant="destructive" className="mt-2">
                  <AlertDescription>{errors.json}</AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}