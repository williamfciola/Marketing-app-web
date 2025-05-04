"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
// import { createProductAction } from '@/actions/product-actions'; // Placeholder for server action

export default function ProductCreationForm() {
  const [creationType, setCreationType] = useState<'niche' | 'idea'>('niche');
  const [niche, setNiche] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.info('Gerando conteúdo com IA... Isso pode levar alguns instantes.');

    const formData = new FormData();
    formData.append('creationType', creationType);
    if (creationType === 'niche') {
      if (!niche.trim()) {
        toast.error('Por favor, informe o nicho.');
        setIsLoading(false);
        return;
      }
      formData.append('niche', niche);
    } else {
      if (!ideaDescription.trim()) {
        toast.error('Por favor, cole a descrição da ideia.');
        setIsLoading(false);
        return;
      }
      formData.append('ideaDescription', ideaDescription);
    }

    try {
      // --- Placeholder for API call/Server Action ---
      console.log('Submitting:', { creationType, niche, ideaDescription });
      // const result = await createProductAction(formData);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      // TODO: Handle result - redirect to product page or show success/error
      // if (result.success && result.productId) {
      //   toast.success('Produto criado com sucesso!');
      //   // redirect(`/produto/${result.productId}`);
      // } else {
      //   toast.error(result.error || 'Falha ao criar produto.');
      // }
      toast.success('Conteúdo gerado (simulado)! Redirecionando...'); // Placeholder
      // Reset form or redirect
      setNiche('');
      setIdeaDescription('');
      // Add redirection logic here later
      // --- End Placeholder ---

    } catch (error) {
      console.error('Creation error:', error);
      toast.error('Ocorreu um erro inesperado ao gerar o conteúdo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Como você quer começar?</CardTitle>
        <CardDescription className="text-gray-400">A IA irá gerar todo o material de marketing necessário.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="niche" onValueChange={(value) => setCreationType(value as 'niche' | 'idea')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-700">
            <TabsTrigger value="niche" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Informar Nicho</TabsTrigger>
            <TabsTrigger value="idea" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">Colar Ideia Pronta</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit}>
            <TabsContent value="niche" className="mt-4 space-y-4">
              <div>
                <Label htmlFor="niche" className="text-gray-300">Nicho de Mercado</Label>
                <Input
                  id="niche"
                  placeholder="Ex: Emagrecimento para mães, Finanças para jovens, Adestramento de cães"
                  value={niche}
                  onChange={(e) => setNiche(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 mt-1"
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500 mt-1">Digite o nicho principal do seu produto.</p>
              </div>
            </TabsContent>
            <TabsContent value="idea" className="mt-4 space-y-4">
              <div>
                <Label htmlFor="ideaDescription" className="text-gray-300">Descrição da Ideia/Produto Existente</Label>
                <Textarea
                  id="ideaDescription"
                  placeholder="Cole aqui a descrição do seu produto ou ideia..."
                  value={ideaDescription}
                  onChange={(e) => setIdeaDescription(e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 mt-1 h-32"
                  disabled={isLoading}
                />
                 <p className="text-xs text-gray-500 mt-1">Quanto mais detalhes, melhor a IA poderá gerar o conteúdo.</p>
              </div>
            </TabsContent>
            <CardFooter className="mt-6 p-0">
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando Mágica...</> : 'Gerar Conteúdo com IA'}
              </Button>
            </CardFooter>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}

