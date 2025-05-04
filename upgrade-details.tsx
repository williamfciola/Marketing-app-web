"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, ExternalLink, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
// import { requestManualUpgrade } from '@/actions/upgrade-actions'; // Placeholder for server action

export default function UpgradeDetails() {
  const [pixCopied, setPixCopied] = useState(false);
  const [isRequestingUpgrade, setIsRequestingUpgrade] = useState(false);

  const pixKey = "5643304b-3bfb-4a54-b803-c91d61b914e0";
  const whatsappLink = "https://wa.me/62981716694"; // Ensure this is the correct number

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey)
      .then(() => {
        setPixCopied(true);
        toast.success("Chave Pix copiada!");
        setTimeout(() => setPixCopied(false), 2000); // Reset icon after 2 seconds
      })
      .catch(err => toast.error("Falha ao copiar Chave Pix."));
  };

  const handleAlreadyPaid = async () => {
    setIsRequestingUpgrade(true);
    toast.info("Processando sua solicitação de upgrade...");
    try {
      // --- Placeholder for Server Action ---
      console.log("Requesting manual upgrade...");
      // const result = await requestManualUpgrade(); // Call server action to notify admin
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate action
      // if (result.success) {
      //   toast.success("Solicitação enviada! Sua conta será atualizada em breve após confirmação.");
      // } else {
      //   toast.error(result.error || "Falha ao solicitar upgrade. Tente novamente ou contate o suporte.");
      // }
      toast.success("Solicitação enviada (simulado)! Sua conta será atualizada em breve após confirmação.");
      // --- End Placeholder ---
    } catch (error) {
      console.error("Upgrade request error:", error);
      toast.error("Ocorreu um erro inesperado. Contate o suporte.");
    } finally {
      setIsRequestingUpgrade(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gray-800/80 border-purple-700/50 text-white backdrop-blur-md shadow-lg shadow-purple-900/20">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          Plano Ilimitado - Crie Sem Limites!
        </CardTitle>
        <CardDescription className="text-gray-300 mt-2 text-lg">
          Desbloqueie todo o potencial do Assistente de Marketing Digital.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        <div className="text-center">
          <p className="text-4xl font-extrabold text-white mb-2">R$ 97,00</p>
          <p className="text-gray-400">Pagamento único, acesso vitalício.</p>
        </div>

        <Card className="bg-gray-700/50 border-gray-600 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-center mb-4 text-purple-300">Pagamento via Pix</h3>
          <p className="text-center text-gray-400 mb-4">Copie a chave Pix abaixo e realize o pagamento no seu banco:</p>
          <div className="flex items-center justify-center space-x-2 bg-gray-800 p-3 rounded border border-gray-500">
            <span className="text-gray-200 font-mono break-all">{pixKey}</span>
            <Button variant="ghost" size="icon" onClick={handleCopyPix} className="text-gray-400 hover:text-white">
              {pixCopied ? <Check className="h-5 w-5 text-green-400" /> : <Copy className="h-5 w-5" />}
            </Button>
          </div>
          <div className="mt-6 text-center">
             <p className="text-gray-400 mb-3">Após realizar o pagamento Pix:</p>
            <Button 
              onClick={handleAlreadyPaid} 
              disabled={isRequestingUpgrade}
              className="w-full md:w-auto bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold px-8 py-3 text-lg"
            >
              {isRequestingUpgrade ? 'Processando...' : 'Já Paguei! Liberar Acesso'}
            </Button>
            <p className="text-xs text-gray-500 mt-2">A liberação é manual e pode levar alguns minutos/horas.</p>
          </div>
        </Card>

        <div className="text-center border-t border-gray-700 pt-6">
          <h3 className="text-lg font-semibold text-gray-300 mb-3">Não tem Pix ou prefere outro método?</h3>
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-900/50 hover:text-green-300">
              <MessageCircle className="h-5 w-5 mr-2" /> Falar no WhatsApp
              <ExternalLink className="h-4 w-4 ml-2 opacity-70" />
            </Button>
          </a>
        </div>

      </CardContent>
    </Card>
  );
}

