import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Mail, ArrowLeft, CheckCircle, RefreshCw } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Adresse email invalide" }),
});

const resetPasswordSchema = z.object({
  code: z.string().min(6, { message: "Le code doit contenir 6 caractères" }),
  newPassword: z.string().min(6, { message: "Le mot de passe doit contenir au moins 6 caractères" }),
  confirmPassword: z.string().min(6, { message: "Confirmez le mot de passe" }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

interface ForgotPasswordProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ForgotPassword({ open, onOpenChange }: ForgotPasswordProps) {
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const forgotForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const resetForm = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      code: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleForgotPassword = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    
    // Simuler l'envoi d'email
    setTimeout(() => {
      setEmail(data.email);
      setStep('code');
      setIsLoading(false);
      
      toast.success("Email envoyé", {
        description: `Un code de récupération a été envoyé à ${data.email}`,
      });
    }, 2000);
  };

  const handleResetPassword = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    
    // Simuler la réinitialisation
    setTimeout(() => {
      setStep('success');
      setIsLoading(false);
      
      toast.success("Mot de passe réinitialisé", {
        description: "Votre mot de passe a été mis à jour avec succès",
      });
    }, 1500);
  };

  const handleClose = () => {
    setStep('email');
    setEmail('');
    forgotForm.reset();
    resetForm.reset();
    onOpenChange(false);
  };

  const generateSecurePassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step === 'email' && (
              <>
                <Mail className="h-5 w-5 text-blue-600" />
                Mot de passe oublié
              </>
            )}
            {step === 'code' && (
              <>
                <RefreshCw className="h-5 w-5 text-orange-600" />
                Réinitialiser le mot de passe
              </>
            )}
            {step === 'success' && (
              <>
                <CheckCircle className="h-5 w-5 text-green-600" />
                Mot de passe réinitialisé
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {step === 'email' && "Entrez votre adresse email pour recevoir un code de récupération"}
            {step === 'code' && `Code envoyé à ${email}`}
            {step === 'success' && "Votre mot de passe a été mis à jour avec succès"}
          </DialogDescription>
        </DialogHeader>

        {step === 'email' && (
          <Form {...forgotForm}>
            <form onSubmit={forgotForm.handleSubmit(handleForgotPassword)} className="space-y-4">
              <FormField
                control={forgotForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="votre.email@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Envoyer le code
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {step === 'code' && (
          <Form {...resetForm}>
            <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-4">
              <FormField
                control={resetForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Code de récupération</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123456"
                        maxLength={6}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={resetForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center justify-between">
                      Nouveau mot de passe
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newPassword = generateSecurePassword();
                          resetForm.setValue("newPassword", newPassword);
                          resetForm.setValue("confirmPassword", newPassword);
                          toast.success("Mot de passe généré", {
                            description: "Un mot de passe sécurisé a été généré automatiquement"
                          });
                        }}
                        className="h-6 px-2 text-xs"
                      >
                        <RefreshCw size={12} className="mr-1" />
                        Générer
                      </Button>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Nouveau mot de passe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={resetForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmer le mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirmer le mot de passe"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('email')}
                  className="flex-1"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Retour
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Réinitialisation...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Réinitialiser
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        )}

        {step === 'success' && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-green-600">
                <CheckCircle className="mx-auto h-12 w-12 mb-2" />
                Succès !
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-gray-600">
                Votre mot de passe a été réinitialisé avec succès.
                Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
              <Button onClick={handleClose} className="w-full">
                Retour à la connexion
              </Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
}
