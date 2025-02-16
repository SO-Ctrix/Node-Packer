'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Plus, 
  List, 
  Edit3, 
  Search,
  BarChart3,
  Boxes
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export type LabelValue = {
  label: string;
  value: number | string;
}

export default function Home() {
  const router = useRouter();

  const [stats, setStats] = React.useState<LabelValue[] | null>(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      const response = await fetch('/api/stats');
      const data = await response.json();
      console.log(data);
      setStats([
        { label: 'Total Packages', value: data.total },
        { label: 'Créés ce mois', value: data.createdThisMonth },
        { label: 'Créés aujourd\'hui', value: data.createdToday },
      ])
    };

    fetchStats();
  }, []);

  const actions = [
    {
      title: 'Créer un package.json',
      description: 'Générer un nouveau fichier package.json pour votre projet',
      icon: <Plus className="h-6 w-6" />,
      color: 'bg-blue-500',
      route: '/create',
    },
    {
      title: 'Liste des packages',
      description: 'Voir et gérer tous vos fichiers package.json',
      icon: <List className="h-6 w-6" />,
      color: 'bg-green-500',
      route: '/list',
    },
    {
      title: 'Rechercher',
      description: 'Rechercher dans vos configurations package.json',
      icon: <Search className="h-6 w-6" />,
      color: 'bg-purple-500',
      route: '/list',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Package className="h-8 w-8 text-blue-500" />
              Node Packer
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez vos configurations Node.js facilement
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats === null && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
          )}

          {stats?.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {actions.map((action, index) => (
            <Card 
              key={index}
              className="hover:shadow-lg transition-all transform hover:-translate-y-1 cursor-pointer"
              onClick={() => router.push(action.route)}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-white mb-4`}>
                  {action.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tips Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Boxes className="h-5 w-5 text-blue-500" />
              Conseils et astuces
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-700 mb-2">Versions Semver</h4>
                <p className="text-sm text-blue-600">
                  Utilisez le format x.y.z pour les versions. Exemple: 1.0.0
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-700 mb-2">Type de module</h4>
                <p className="text-sm text-green-600">
                  Choisissez entre "module" pour ESM et "commonjs" pour require()
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
