"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, LogOut, Edit, Trash2, Eye, Zap } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';

// Define types for props (adjust based on actual data structure later)
interface Product {
  id: number;
  product_name: string;
  created_at: string;
}

interface DashboardLayoutProps {
  userEmail: string | null | undefined;
  products: Product[];
  plan: string;
  productCount: number;
}

export default function DashboardLayout({ userEmail, products, plan, productCount }: DashboardLayoutProps) {
  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  const canCreateProduct = plan === 'pago' || productCount < 2;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-4 md:p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Assistente de Marketing</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400 hidden md:inline">{userEmail}</span>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-400 hover:text-white">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {plan === 'gratuito' && productCount >= 2 && (
        <Card className="mb-6 bg-yellow-900/30 border-yellow-700 text-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center"><Zap className="mr-2 h-5 w-5"/> Limite Atingido!</CardTitle>
            <CardDescription className="text-yellow-300">Você atingiu o limite de 2 produtos no plano gratuito.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Faça upgrade para o plano pago e crie produtos ilimitados!</p>
            <Link href="/upgrade">
              <Button className="mt-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">Fazer Upgrade Agora</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <main>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold">Seus Produtos Digitais</h2>
          <Link href="/criar-produto">
            <Button 
              className={`bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white ${!canCreateProduct ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!canCreateProduct}
              title={!canCreateProduct ? 'Limite de produtos atingido no plano gratuito' : 'Criar novo produto'}
            >
              <PlusCircle className="mr-2 h-5 w-5" /> Criar Produto com IA
            </Button>
          </Link>
        </div>

        {products.length === 0 ? (
          <Card className="text-center py-12 bg-gray-800 border-gray-700">
            <CardContent>
              <p className="text-gray-400">Você ainda não criou nenhum produto.</p>
              <p className="text-gray-500 mt-2">Clique em "Criar Produto com IA" para começar!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors duration-200">
                <CardHeader>
                  <CardTitle className="text-lg truncate">{product.product_name || 'Produto Sem Nome'}</CardTitle>
                  <CardDescription className="text-xs text-gray-500">Criado em: {new Date(product.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm" className="border-blue-500 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300">
                    <Eye className="h-4 w-4 mr-1" /> Visualizar
                  </Button>
                  <Button variant="outline" size="sm" className="border-yellow-500 text-yellow-400 hover:bg-yellow-900/50 hover:text-yellow-300">
                    <Edit className="h-4 w-4 mr-1" /> Editar
                  </Button>
                  <Button variant="outline" size="sm" className="border-red-500 text-red-400 hover:bg-red-900/50 hover:text-red-300">
                    <Trash2 className="h-4 w-4 mr-1" /> Deletar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {plan === 'gratuito' && productCount < 2 && (
         <p className="text-center text-sm text-gray-500 mt-8">Você pode criar mais {2 - productCount} produto(s) no plano gratuito.</p>
      )}
       {plan === 'pago' && (
         <p className="text-center text-sm text-green-400 mt-8">Você está no plano pago. Criações ilimitadas!</p>
      )}

    </div>
  );
}

