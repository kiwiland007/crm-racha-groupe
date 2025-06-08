import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  MessageSquare,
  Phone,
  Key,
  Globe,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Copy,
  ExternalLink,
  Smartphone,
  Settings,
  Zap
} from "lucide-react";

interface WhatsAppConfigWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface WhatsAppConfig {
  businessName: string;
  phoneNumber: string;
  displayName: string;
  businessDescription: string;
  apiToken: string;
  webhookUrl: string;
  verifyToken: string;
  businessCategory: string;
  website: string;
}

export function WhatsAppConfigWizard({ open, onOpenChange }: WhatsAppConfigWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [config, setConfig] = useState<WhatsAppConfig>({
    businessName: "Racha Business Group",
    phoneNumber: "+212661234567",
    displayName: "Racha Business",
    businessDescription: "Spécialiste des solutions d'écrans tactiles interactifs pour professionnels",
    apiToken: "",
    webhookUrl: "https://api.rachabusinessgroup.com/webhook/whatsapp",
    verifyToken: "",
    businessCategory: "Technology",
    website: "https://rachabusinessgroup.ma"
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'connecting' | 'success' | 'error'>('idle');

  const steps = [
    {
      id: 1,
      title: "Informations Business",
      description: "Configurez les informations de votre entreprise",
      icon: <MessageSquare className="h-5 w-5" />
    },
    {
      id: 2,
      title: "Configuration API",
      description: "Configurez l'API WhatsApp Business",
      icon: <Key className="h-5 w-5" />
    },
    {
      id: 3,
      title: "Webhooks",
      description: "Configurez les webhooks pour recevoir les messages",
      icon: <Globe className="h-5 w-5" />
    },
    {
      id: 4,
      title: "Test & Validation",
      description: "Testez la connexion et validez la configuration",
      icon: <CheckCircle className="h-5 w-5" />
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleTestConnection = async () => {
    setIsConnecting(true);
    setConnectionStatus('connecting');
    
    // Simulation de test de connexion
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (config.apiToken && config.phoneNumber) {
        setConnectionStatus('success');
        toast.success("Connexion WhatsApp réussie", {
          description: "Votre configuration WhatsApp Business est opérationnelle"
        });
      } else {
        throw new Error("Configuration incomplète");
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error("Erreur de connexion", {
        description: "Vérifiez vos paramètres et réessayez"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSaveConfiguration = () => {
    // Sauvegarder la configuration
    localStorage.setItem('whatsapp_config', JSON.stringify(config));
    toast.success("Configuration sauvegardée", {
      description: "Votre configuration WhatsApp Business a été enregistrée"
    });
    onOpenChange(false);
  };

  const generateVerifyToken = () => {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    setConfig({ ...config, verifyToken: token });
    toast.success("Token généré", {
      description: "Un nouveau token de vérification a été généré"
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copié`, {
      description: "Le contenu a été copié dans le presse-papiers"
    });
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="businessName">Nom de l'entreprise</Label>
                <Input
                  id="businessName"
                  value={config.businessName}
                  onChange={(e) => setConfig({ ...config, businessName: e.target.value })}
                  placeholder="Racha Business Group"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="displayName">Nom d'affichage WhatsApp</Label>
                <Input
                  id="displayName"
                  value={config.displayName}
                  onChange={(e) => setConfig({ ...config, displayName: e.target.value })}
                  placeholder="Racha Business"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
                <Input
                  id="phoneNumber"
                  value={config.phoneNumber}
                  onChange={(e) => setConfig({ ...config, phoneNumber: e.target.value })}
                  placeholder="+212661234567"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="businessDescription">Description de l'entreprise</Label>
                <Textarea
                  id="businessDescription"
                  value={config.businessDescription}
                  onChange={(e) => setConfig({ ...config, businessDescription: e.target.value })}
                  placeholder="Décrivez votre entreprise..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="businessCategory">Catégorie</Label>
                  <Input
                    id="businessCategory"
                    value={config.businessCategory}
                    onChange={(e) => setConfig({ ...config, businessCategory: e.target.value })}
                    placeholder="Technology"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Site web</Label>
                  <Input
                    id="website"
                    value={config.website}
                    onChange={(e) => setConfig({ ...config, website: e.target.value })}
                    placeholder="https://rachabusinessgroup.ma"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">Configuration API WhatsApp Business</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Vous devez avoir un compte WhatsApp Business API. 
                    <a href="https://business.whatsapp.com/" target="_blank" rel="noopener noreferrer" className="underline ml-1">
                      Créer un compte <ExternalLink className="h-3 w-3 inline" />
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="apiToken">Token d'accès API</Label>
                <div className="flex space-x-2">
                  <Input
                    id="apiToken"
                    type="password"
                    value={config.apiToken}
                    onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
                    placeholder="Entrez votre token d'accès WhatsApp Business API"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(config.apiToken, "Token API")}
                    disabled={!config.apiToken}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Obtenez ce token depuis votre tableau de bord WhatsApp Business API
                </p>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <Globe className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Configuration Webhook</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Les webhooks permettent de recevoir les messages en temps réel
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="webhookUrl">URL Webhook</Label>
                <div className="flex space-x-2">
                  <Input
                    id="webhookUrl"
                    value={config.webhookUrl}
                    onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                    placeholder="https://api.rachabusinessgroup.com/webhook/whatsapp"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(config.webhookUrl, "URL Webhook")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="verifyToken">Token de vérification</Label>
                <div className="flex space-x-2">
                  <Input
                    id="verifyToken"
                    value={config.verifyToken}
                    onChange={(e) => setConfig({ ...config, verifyToken: e.target.value })}
                    placeholder="Token de vérification pour webhook"
                  />
                  <Button
                    variant="outline"
                    onClick={generateVerifyToken}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Générer
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Ce token sécurise votre webhook contre les accès non autorisés
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Test de connexion
                </CardTitle>
                <CardDescription>
                  Vérifiez que votre configuration fonctionne correctement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium">API WhatsApp Business</p>
                        <p className="text-sm text-muted-foreground">
                          {config.phoneNumber}
                        </p>
                      </div>
                    </div>
                    <Badge 
                      variant={connectionStatus === 'success' ? 'default' : 'secondary'}
                      className={connectionStatus === 'success' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {connectionStatus === 'success' ? '✓ Connecté' : 
                       connectionStatus === 'error' ? '✗ Erreur' : 
                       connectionStatus === 'connecting' ? '⏳ Test...' : '○ Non testé'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Webhook</p>
                        <p className="text-sm text-muted-foreground">
                          {config.webhookUrl}
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {config.verifyToken ? '✓ Configuré' : '○ Non configuré'}
                    </Badge>
                  </div>
                </div>

                <Button 
                  onClick={handleTestConnection}
                  disabled={isConnecting || !config.apiToken}
                  className="w-full"
                >
                  {isConnecting ? (
                    <>
                      <Settings className="h-4 w-4 mr-2 animate-spin" />
                      Test en cours...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Tester la connexion
                    </>
                  )}
                </Button>

                {connectionStatus === 'success' && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <p className="text-green-800 font-medium">Configuration validée !</p>
                    </div>
                    <p className="text-green-700 text-sm mt-1">
                      Votre intégration WhatsApp Business est prête à être utilisée.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            Assistant de configuration WhatsApp Business
          </DialogTitle>
          <DialogDescription>
            Configurez votre intégration WhatsApp Business en quelques étapes simples
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                currentStep >= step.id 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : 'border-gray-300 text-gray-500'
              }`}>
                {currentStep > step.id ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  currentStep > step.id ? 'bg-green-600' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Current Step Info */}
        <div className="mb-6">
          <h3 className="font-medium text-lg">{steps[currentStep - 1].title}</h3>
          <p className="text-sm text-muted-foreground">{steps[currentStep - 1].description}</p>
        </div>

        <Separator className="mb-6" />

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>

          <div className="flex space-x-2">
            {currentStep === steps.length ? (
              <Button
                onClick={handleSaveConfiguration}
                disabled={connectionStatus !== 'success'}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Terminer la configuration
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Suivant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
