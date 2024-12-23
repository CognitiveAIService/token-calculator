'use client'

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { InfoIcon, Mail} from 'lucide-react';

interface Prices {
  input: {
    regular: number;
    batch: number;
  };
  output: {
    regular: number;
    batch: number;
  };
}

interface PriceInputProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}

const PricingCalculator: React.FC = () => {
  const [inputMethod, setInputMethod] = useState<string>('pages');
  const [outputMethod, setOutputMethod] = useState<string>('characters');
  const [inputValue, setInputValue] = useState<string>('');
  const [outputValue, setOutputValue] = useState<string>('');
  const [inputTokens, setInputTokens] = useState<number>(0);
  const [outputTokens, setOutputTokens] = useState<number>(0);
  const [prices, setPrices] = useState<Prices>({
    input: {
      regular: 0.003,
      batch: 0.0015
    },
    output: {
      regular: 0.015,
      batch: 0.0075
    }
  });

  const CHARS_PER_TOKEN = 4;
  const WORDS_PER_PAGE = 250;
  const CHARS_PER_PAGE = WORDS_PER_PAGE * 5;

  const calculateTokens = (text: string | number): number => {
    if (!text) return 0;
    const chars = typeof text === 'string' ? text.length : Number(text);
    return Math.ceil(chars / CHARS_PER_TOKEN);
  };

  useEffect(() => {
    let chars = 0;
    if (inputMethod === 'pages') {
      chars = Number(inputValue) * CHARS_PER_PAGE;
    } else if (inputMethod === 'characters') {
      chars = Number(inputValue);
    } else if (inputMethod === 'text') {
      chars = inputValue.length;
    }
    setInputTokens(calculateTokens(chars));
  }, [inputValue, inputMethod]);

  useEffect(() => {
    let chars = 0;
    if (outputMethod === 'characters') {
      chars = Number(outputValue);
    } else if (outputMethod === 'text') {
      chars = outputValue.length;
    }
    setOutputTokens(calculateTokens(chars));
  }, [outputValue, outputMethod]);

  const calculatePrice = (tokens: number, type: 'input' | 'output', mode: 'regular' | 'batch'): string => {
    if (!tokens) return '0';
    return ((tokens / 1000) * prices[type][mode]).toFixed(4);
  };

  const calculateTotalPrice = (mode: 'regular' | 'batch'): string => {
    const inputPrice = Number(calculatePrice(inputTokens, 'input', mode));
    const outputPrice = Number(calculatePrice(outputTokens, 'output', mode));
    return (inputPrice + outputPrice).toFixed(4);
  };

  const PriceInput: React.FC<PriceInputProps> = ({ value, onChange, label }) => (
    <div className="flex items-center gap-2">
      <span className="text-sm text-muted-foreground min-w-20">{label}:</span>
      <div className="relative">
        <span className="absolute left-2 top-1/2 -translate-y-1/2">$</span>
        <Input
          type="number"
          value={value}
          onChange={onChange}
          className="w-24 pl-6 h-8"
          step="0.0001"
        />
      </div>
    </div>
  );

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-2xl font-bold">Token Pricing Calculator</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Calculate your token usage costs</p>
        </div>
        <img src="/CORTEX-banner.png" alt="Logo" className="w-64 h-26 rounded-lg shadow-sm" />      </CardHeader>

      <CardContent className="space-y-6">
        <div className="bg-secondary/10 p-4 rounded-lg space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Pricing Rates</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <InfoIcon className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Price per 1000 tokens</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Input Tokens</h4>
              <PriceInput
                label="Regular"
                value={prices.input.regular}
                onChange={(e) => setPrices(prev => ({
                  ...prev,
                  input: { ...prev.input, regular: Number(e.target.value) }
                }))}
              />
              <PriceInput
                label="Batch"
                value={prices.input.batch}
                onChange={(e) => setPrices(prev => ({
                  ...prev,
                  input: { ...prev.input, batch: Number(e.target.value) }
                }))}
              />
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Output Tokens</h4>
              <PriceInput
                label="Regular"
                value={prices.output.regular}
                onChange={(e) => setPrices(prev => ({
                  ...prev,
                  output: { ...prev.output, regular: Number(e.target.value) }
                }))}
              />
              <PriceInput
                label="Batch"
                value={prices.output.batch}
                onChange={(e) => setPrices(prev => ({
                  ...prev,
                  output: { ...prev.output, batch: Number(e.target.value) }
                }))}
              />
            </div>
          </div>

          <Separator />
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <Badge variant="outline" className="mb-1">Tokens</Badge>
              <p>4 chars = 1 token</p>
            </div>
            <div>
              <Badge variant="outline" className="mb-1">Pages</Badge>
              <p>250 words = 1 page</p>
            </div>
            <div>
              <Badge variant="outline" className="mb-1">Characters</Badge>
              <p>1250 chars = 1 page</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Input Tokens</h3>
          <Tabs defaultValue="pages" onValueChange={setInputMethod}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="characters">Characters</TabsTrigger>
              <TabsTrigger value="text">Text</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pages">
              <div className="space-y-2">
                <Label>Number of Pages</Label>
                <Input 
                  type="number" 
                  min="0" 
                  step="0.1"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)} 
                />
              </div>
            </TabsContent>

            <TabsContent value="characters">
              <div className="space-y-2">
                <Label>Number of Characters</Label>
                <Input 
                  type="number" 
                  min="0"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)} 
                />
              </div>
            </TabsContent>

            <TabsContent value="text">
              <div className="space-y-2">
                <Label>Input Text</Label>
                <Textarea 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Output Tokens</h3>
          <Tabs defaultValue="characters" onValueChange={setOutputMethod}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="characters">Expected Characters</TabsTrigger>
              <TabsTrigger value="text">Example Text</TabsTrigger>
            </TabsList>

            <TabsContent value="characters">
              <div className="space-y-2">
                <Label>Expected Output Characters</Label>
                <Input 
                  type="number" 
                  min="0"
                  value={outputValue}
                  onChange={(e) => setOutputValue(e.target.value)} 
                />
              </div>
            </TabsContent>

            <TabsContent value="text">
              <div className="space-y-2">
                <Label>Example Output Text</Label>
                <Textarea 
                  value={outputValue}
                  onChange={(e) => setOutputValue(e.target.value)}
                  rows={4}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4 bg-secondary/10 p-4 rounded-lg">
          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Input Tokens</h4>
              <span className="font-mono">{inputTokens.toLocaleString()}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1 space-y-1">
              <div className="flex justify-between">
                <span>Regular Price:</span>
                <span>${calculatePrice(inputTokens, 'input', 'regular')}</span>
              </div>
              <div className="flex justify-between">
                <span>Batch Price:</span>
                <span>${calculatePrice(inputTokens, 'input', 'batch')}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Output Tokens</h4>
              <span className="font-mono">{outputTokens.toLocaleString()}</span>
            </div>
            <div className="text-sm text-muted-foreground mt-1 space-y-1">
              <div className="flex justify-between">
                <span>Regular Price:</span>
                <span>${calculatePrice(outputTokens, 'output', 'regular')}</span>
              </div>
              <div className="flex justify-between">
                <span>Batch Price:</span>
                <span>${calculatePrice(outputTokens, 'output', 'batch')}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h4 className="font-medium mb-1">Total Price</h4>
            <div className="text-sm space-y-1">
              <div className="flex justify-between font-medium">
                <span>Regular:</span>
                <span>${calculateTotalPrice('regular')}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Batch:</span>
                <span>${calculateTotalPrice('batch')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-secondary/10 p-4 rounded-lg space-y-3">
          <h3 className="font-medium flex items-center gap-2">
            Contact Us
            <Badge variant="secondary">Support</Badge>
          </h3>
          <p className="text-sm text-muted-foreground">
            Need help with your project? We can help! Get in touch with our team.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <a href="mailto:contacto@cognitiveai.cloud" className="text-primary hover:underline">
              contacto@cognitiveai.cloud
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PricingCalculator;