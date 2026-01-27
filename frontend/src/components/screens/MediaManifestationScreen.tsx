import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { ImageIcon, Video, Upload, X, AlertCircle, FileImage, FileVideo } from "lucide-react";
import Header from "@/components/Header";
import ProgressStepper from "@/components/ui/ProgressStepper";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MediaManifestationScreenProps {
  onBack: () => void;
  onSubmit: (data: {
    file: File;
    description: string;
    isAnonymous: boolean;
  }) => void;
}

export default function MediaManifestationScreen({
  onBack,
  onSubmit,
}: MediaManifestationScreenProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxFileSize = 50 * 1024 * 1024; // 50MB
  const acceptedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm"];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!acceptedTypes.includes(file.type)) {
      setError("Formato não suportado. Use imagens (JPG, PNG) ou vídeos (MP4).");
      return;
    }

    if (file.size > maxFileSize) {
      setError("Arquivo muito grande. O tamanho máximo é 50MB.");
      return;
    }

    setSelectedFile(file);
    setError("");

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setError("Por favor, selecione uma imagem ou vídeo.");
      return;
    }
    onSubmit({ file: selectedFile, description: description.trim(), isAnonymous });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const isVideo = selectedFile?.type.startsWith("video/");

  return (
    <div className="main-container">
      <Header showBackButton onBack={onBack} title="Enviar Mídia" />

      <ProgressStepper currentStep={2} totalSteps={3} />

      <main className="flex-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="flex items-center gap-3 p-4 bg-primary-light rounded-xl">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <ImageIcon className="w-5 h-5 text-primary-foreground" />
            </div>
            <p className="text-sm text-foreground">
              Envie fotos ou vídeos como evidência da sua manifestação. Máximo de
              50MB por arquivo.
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,video/mp4,video/webm"
            onChange={handleFileSelect}
            className="hidden"
            id="media-upload"
          />

          {!selectedFile ? (
            <motion.label
              htmlFor="media-upload"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-border rounded-2xl cursor-pointer hover:border-primary hover:bg-primary-light transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-lg font-medium text-foreground mb-2">
                Toque para selecionar
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Imagens (JPG, PNG) ou Vídeos (MP4)
                <br />
                Máximo 50MB
              </p>
            </motion.label>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-secondary rounded-2xl p-4"
            >
              <button
                onClick={removeFile}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-background/90 flex items-center justify-center hover:bg-destructive hover:text-destructive-foreground transition-colors z-10"
                aria-label="Remover arquivo"
              >
                <X className="w-5 h-5" />
              </button>

              {preview ? (
                <img
                  src={preview}
                  alt="Prévia da imagem selecionada"
                  className="w-full h-48 object-cover rounded-xl"
                />
              ) : (
                <div className="w-full h-48 flex flex-col items-center justify-center bg-muted rounded-xl">
                  {isVideo ? (
                    <FileVideo className="w-16 h-16 text-muted-foreground mb-2" />
                  ) : (
                    <FileImage className="w-16 h-16 text-muted-foreground mb-2" />
                  )}
                  <p className="text-muted-foreground">Vídeo selecionado</p>
                </div>
              )}

              <div className="mt-4 flex items-center gap-3">
                {isVideo ? (
                  <Video className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="space-y-2">
            <Label htmlFor="media-description" className="text-base font-medium">
              Descrição (opcional)
            </Label>
            <Textarea
              id="media-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o contexto da imagem ou vídeo..."
              className="min-h-[100px] text-base resize-none"
              maxLength={500}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-lg"
              role="alert"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </motion.div>
          )}

          <div className="flex items-start space-x-3 p-4 bg-secondary rounded-xl">
            <Checkbox
              id="anonymous-media"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked === true)}
            />
            <div className="space-y-1">
              <Label htmlFor="anonymous-media" className="font-medium cursor-pointer">
                Desejo permanecer anônimo(a)
              </Label>
              <p className="text-sm text-muted-foreground">
                Sua identidade não será revelada no registro da manifestação.
              </p>
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            size="lg"
            className="w-full text-lg h-14"
            disabled={!selectedFile}
          >
            Enviar Manifestação
          </Button>
        </motion.div>
      </main>
    </div>
  );
}
