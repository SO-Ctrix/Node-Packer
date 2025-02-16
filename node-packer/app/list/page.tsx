'use client';

import { PackageJsonWithMeta } from '@/types/package';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { PackageJson } from 'type-fest';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, Pencil, Trash, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';


export default function ListPackages() {
    const router = useRouter();
    const [packages, setPackages] = useState<PackageJsonWithMeta[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [isLoading, setIsLoading] = useState(true);
  
    // Récupérer toutes les catégories uniques
    const allCategories = [...new Set(packages.flatMap(pkg => pkg.categories))];

  const fetchPackages = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (categoryFilter !== "all") {
        if (categoryFilter) params.append('category', categoryFilter);
      }

      const response = await fetch(`/api/list?${params}`);
      if (!response.ok) throw new Error('Erreur lors de la récupération des packages');
      
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la récupération des packages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, [searchTerm, categoryFilter]);

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce package ?')) return;

    try {
      const response = await fetch(`/api/list?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      toast.success('Package supprimé avec succès');
      fetchPackages(); // Rafraîchir la liste
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erreur lors de la suppression du package');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Liste des package.json</CardTitle>
            <Button onClick={() => router.push('/create')}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau package.json
            </Button>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par nom ou auteur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {allCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Chargement...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-gray-500">Nom</th>
                    <th className="text-left p-4 font-medium text-gray-500">Version</th>
                    <th className="text-left p-4 font-medium text-gray-500">Auteur</th>
                    <th className="text-left p-4 font-medium text-gray-500">Catégories</th>
                    <th className="text-left p-4 font-medium text-gray-500">Créé le</th>
                    <th className="text-right p-4 font-medium text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {packages.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        Aucun package.json trouvé
                      </td>
                    </tr>
                  ) : (
                    packages.map((pkg) => (
                      <tr key={pkg.id} className="border-b hover:bg-gray-50">
                        <td className="p-4">{pkg.name}</td>
                        <td className="p-4">{pkg.version}</td>
                        <td className="p-4">{pkg.author as string}</td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            {pkg.categories.map(category => (
                              <Badge key={category} variant="secondary">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-4">{formatDate(pkg.createdAt)}</td>
                        <td className="p-4">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => router.push(`/edit/${pkg.id}`)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDelete(pkg.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};