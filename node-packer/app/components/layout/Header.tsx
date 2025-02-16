// components/layout/Header.tsx
'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Package, Home, List, Plus} from 'lucide-react';
import { Button } from "@/components/ui/button";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    { name: 'Accueil', href: '/', icon: Home },
    { name: 'Liste', href: '/list', icon: List },
    { name: 'Créer', href: '/create', icon: Plus },
  ];

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo et titre */}
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => router.push('/')}
          >
            <Package className="h-6 w-6 text-blue-500" />
            <span className="text-xl font-bold text-gray-900">Node Packer</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={`flex items-center gap-2 ${
                    isActive 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => router.push(item.href)}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.name}</span>
                </Button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}