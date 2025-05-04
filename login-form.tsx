"'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner'; // Assuming sonner is installed or part of the template for notifications

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // For now, using email provider. Adapt if using Credentials.
      const result = await signIn('email', { email, redirect: false, callbackUrl: '/' });

      if (result?.error) {
        toast.error('Falha no login: ' + result.error);
      } else if (result?.ok) {
        // Typically, email provider sends a magic link. Inform the user.
        toast.success('Verifique seu e-mail para o link de login!');
        // Optionally redirect or clear form
        setEmail('');
      } else {
         toast.info('Link de login enviado! Verifique seu e-mail.');
         setEmail('');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Ocorreu um erro inesperado durante o login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-sm bg-gray-800 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">Assistente de Marketing Digital</CardTitle>
        <CardDescription className="text-center text-gray-400">Acesse sua conta para criar produtos incríveis com IA.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold" disabled={isLoading}>
            {isLoading ? 'Enviando...' : 'Entrar / Registrar com Email'}
          </Button>
        </form>
      </CardContent>
       <CardFooter className="text-center text-xs text-gray-500">
        Ao entrar, você concorda com nossos Termos e Política de Privacidade.
      </CardFooter>
    </Card>
  );
}

