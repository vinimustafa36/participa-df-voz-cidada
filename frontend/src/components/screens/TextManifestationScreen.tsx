import { useState } from "react";
import { motion } from "framer-motion";
import { PenLine, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import ProgressStepper from "@/components/ui/ProgressStepper";
import ContactForm from "@/components/ui/ContactForm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TextManifestationScreenProps {
  onBack: () => void;
  onSubmit: (data: { content: string; isAnonymous: boolean; email?: string; name?: string }) => void;
}

export default function TextManifestationScreen({
  onBack,
  onSubmit,
}: TextManifestationScreenProps) {
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const maxCharacters = 2000;
  const charactersLeft = maxCharacters - content.length;

  const handleSubmit = () => {
    if (content.trim().length === 0) {
      setError("Por favor, escreva sua manifestação.");
      return;
    }
    setError("");
    onSubmit({ 
      content: content.trim(), 
      isAnonymous,
      email: isAnonymous ? undefined : email || undefined,
      name: isAnonymous ? undefined : name || undefined,
    });
  };

  return (
    <div className="app-background geometric-pattern">
      <div className="main-container">
        <Header showBackButton onBack={onBack} title="Escrever Manifestação" />
        <ProgressStepper currentStep={2} totalSteps={3} />

        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            <div className="info-card">
              <div className="info-card-icon" aria-hidden="true">
                <PenLine className="w-6 h-6 text-primary-foreground" />
              </div>
              <p className="text-sm text-slate-700">
                Descreva sua manifestação com clareza. Quanto mais detalhes, melhor poderemos atendê-lo(a).
              </p>
            </div>

            <div className="elegant-card space-y-4">
              <Label htmlFor="manifestation-text" className="text-base font-medium text-slate-800">
                Sua manifestação
              </Label>
              <Textarea
                id="manifestation-text"
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                  if (error) setError("");
                }}
                placeholder="Escreva aqui sua sugestão, reclamação, elogio ou denúncia..."
                className="min-h-[180px] text-base resize-none border-slate-200 bg-white text-slate-800 placeholder:text-slate-400"
                maxLength={maxCharacters}
                aria-describedby="char-count"
                aria-invalid={!!error}
              />
              <div id="char-count" className="flex justify-between text-sm text-slate-600">
                <span>{content.length} caracteres</span>
                <span className={charactersLeft < 100 ? "text-red-600 font-medium" : ""} aria-live="polite">
                  {charactersLeft} restantes
                </span>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-xl"
                role="alert"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </motion.div>
            )}

            <ContactForm
              isAnonymous={isAnonymous}
              onAnonymousChange={setIsAnonymous}
              email={email}
              onEmailChange={setEmail}
              name={name}
              onNameChange={setName}
            />

            <Button
              onClick={handleSubmit}
              size="lg"
              className="w-full text-lg h-14"
              disabled={content.trim().length === 0}
            >
              Enviar Manifestação
            </Button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
