"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

// Define type for product data (should match the structure fetched in page.tsx)
interface ProductData {
  id: number;
  product_name?: string | null;
  persuasive_description?: string | null;
  main_promise?: string | null;
  offer_copy?: string | null;
  ad_copy_facebook?: string | null;
  ad_copy_instagram?: string | null;
  ad_copy_google?: string | null;
  vsl_script?: string | null;
  landing_page_structure?: string | null;
  titles_suggestions?: string | null;
  cta_suggestions?: string | null;
  target_audience_suggestion?: string | null;
  cover_image_placeholder?: string | null;
  ad_creative_placeholder?: string | null;
  // Add other fields as needed
}

interface ProductViewProps {
  product: ProductData;
}

// Helper component for displaying sections with copy button
const InfoSection = ({ title, content }: { title: string; content: string | null | undefined }) => {
  if (!content) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(content)
      .then(() => toast.success(`"${title}" copiado para a área de transferência!`))
      .catch(err => toast.error('Falha ao copiar texto.'));
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-purple-300">{title}</h3>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="text-gray-400 hover:text-white">
          <Copy className="h-4 w-4 mr-1" /> Copiar
        </Button>
      </div>
      <p className="text-gray-300 whitespace-pre-wrap bg-gray-800 p-3 rounded border border-gray-700">{content}</p>
    </div>
  );
};

// Helper component for image placeholders
const ImagePlaceholder = ({ title, src }: { title: string; src: string | null | undefined }) => {
  if (!src) return null;
  return (
    <div className="mb-6">
       <h3 className="text-lg font-semibold text-purple-300 mb-2">{title}</h3>
       <div className="bg-gray-700 border border-gray-600 rounded p-4 flex flex-col items-center justify-center h-48">
         <p className="text-gray-400 mb-2">Placeholder para Imagem</p>
         <p className="text-xs text-gray-500">({src})</p>
         <p className="text-xs text-gray-500 mt-2">Integração com API de imagem (Stability/DALL-E) pendente.</p>
         {/* Placeholder visual element */}
         <div className="w-24 h-24 bg-gray-600 rounded mt-2 flex items-center justify-center text-gray-400">
           IMG
         </div>
       </div>
    </div>
  );
}

export default function ProductView({ product }: ProductViewProps) {
  return (
    <Card className="w-full bg-gray-800/50 border-gray-700 text-white backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
          {product.product_name || 'Produto Gerado'}
        </CardTitle>
        <CardDescription className="text-gray-400">Detalhes do produto gerado pela IA.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <InfoSection title="Nome do Produto" content={product.product_name} />
        <InfoSection title="Descrição Persuasiva" content={product.persuasive_description} />
        <InfoSection title="Promessa Principal" content={product.main_promise} />
        <InfoSection title="Copy da Oferta" content={product.offer_copy} />
        
        <h3 className="text-xl font-semibold text-purple-300 border-t border-gray-700 pt-4 mt-6">Materiais de Anúncio</h3>
        <InfoSection title="Copy para Facebook Ads" content={product.ad_copy_facebook} />
        <InfoSection title="Copy para Instagram Ads" content={product.ad_copy_instagram} />
        <InfoSection title="Copy para Google Ads" content={product.ad_copy_google} />
        <ImagePlaceholder title="Criativo para Anúncios (Placeholder)" src={product.ad_creative_placeholder} />

        <h3 className="text-xl font-semibold text-purple-300 border-t border-gray-700 pt-4 mt-6">Estrutura de Vendas</h3>
        <InfoSection title="Roteiro para Vídeo de Vendas (VSL)" content={product.vsl_script} />
        <InfoSection title="Estrutura de Landing Page" content={product.landing_page_structure} />
        <InfoSection title="Sugestões de Títulos" content={product.titles_suggestions} />
        <InfoSection title="Sugestões de CTA (Call-to-Action)" content={product.cta_suggestions} />

        <h3 className="text-xl font-semibold text-purple-300 border-t border-gray-700 pt-4 mt-6">Detalhes Adicionais</h3>
        <InfoSection title="Sugestão de Público-Alvo" content={product.target_audience_suggestion} />
        <ImagePlaceholder title="Capa do Produto (Placeholder)" src={product.cover_image_placeholder} />

      </CardContent>
    </Card>
  );
}

