import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Mic, Square, Play, Pause, Trash2, AlertCircle, Check, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import ProgressStepper from "@/components/ui/ProgressStepper";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface AudioManifestationScreenProps {
  onBack: () => void;
  onSubmit: (data: { audioBlob: Blob; isAnonymous: boolean }) => void;
}

export default function AudioManifestationScreen({
  onBack,
  onSubmit,
}: AudioManifestationScreenProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [error, setError] = useState("");
  
  // Transcription states
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState("");
  const [isTranscriptionConfirmed, setIsTranscriptionConfirmed] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const maxDuration = 180; // 3 minutes

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const transcribeAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    setError("");
    
    try {
      const formData = new FormData();
      formData.append("audio", blob, "recording.webm");

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/transcribe-audio`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Falha na transcrição");
      }

      const data = await response.json();
      setTranscription(data.text || "");
      
      if (!data.text) {
        toast.warning("Não foi possível transcrever o áudio. Verifique se falou claramente.");
      }
    } catch (err) {
      console.error("Transcription error:", err);
      setError("Erro ao transcrever o áudio. Tente novamente.");
      toast.error("Erro ao transcrever o áudio");
    } finally {
      setIsTranscribing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach((track) => track.stop());
        
        // Automatically transcribe after recording
        await transcribeAudio(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      setTranscription("");
      setIsTranscriptionConfirmed(false);

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          if (prev >= maxDuration) {
            stopRecording();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);

      setError("");
    } catch (err) {
      setError(
        "Não foi possível acessar o microfone. Verifique as permissões do navegador."
      );
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const deleteRecording = () => {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioBlob(null);
    setAudioUrl(null);
    setRecordingTime(0);
    setIsPlaying(false);
    setTranscription("");
    setIsTranscriptionConfirmed(false);
  };

  const handleSubmit = () => {
    if (!audioBlob) {
      setError("Por favor, grave uma mensagem de áudio.");
      return;
    }
    if (!isTranscriptionConfirmed) {
      setError("Por favor, confirme o conteúdo da transcrição antes de enviar.");
      return;
    }
    onSubmit({ audioBlob, isAnonymous });
  };

  return (
    <div className="app-background geometric-pattern">
      <div className="main-container">
        <Header showBackButton onBack={onBack} title="Gravar Áudio" />

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
                <Mic className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-sm text-slate-700">
                Grave sua manifestação em até 3 minutos. Fale com clareza e próximo
                ao microfone.
              </p>
            </div>

            <div className="elegant-card">
              <div className="flex flex-col items-center py-6 space-y-6">
                {!audioBlob ? (
                  <>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`w-28 h-28 rounded-full flex items-center justify-center transition-colors focus-visible:ring-4 focus-visible:ring-ring ${
                        isRecording
                          ? "bg-destructive text-destructive-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                      aria-label={isRecording ? "Parar gravação" : "Iniciar gravação"}
                    >
                      {isRecording ? (
                        <Square className="w-10 h-10" />
                      ) : (
                        <Mic className="w-10 h-10" />
                      )}
                    </motion.button>

                    {isRecording && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center"
                      >
                        <div className="flex items-center gap-2 justify-center mb-2">
                          <span className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
                          <span className="text-lg font-medium text-destructive">
                            Gravando
                          </span>
                        </div>
                        <p className="text-3xl font-mono font-bold text-slate-800">
                          {formatTime(recordingTime)}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          Máximo: {formatTime(maxDuration)}
                        </p>
                      </motion.div>
                    )}

                    {!isRecording && (
                      <p className="text-slate-600 text-center">
                        Toque no botão para iniciar a gravação
                      </p>
                    )}
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full space-y-4"
                  >
                    <div className="bg-slate-100 p-4 rounded-xl text-center">
                      <p className="text-sm text-slate-600 mb-1">
                        Áudio gravado
                      </p>
                      <p className="text-2xl font-mono font-bold text-slate-800">
                        {formatTime(recordingTime)}
                      </p>
                    </div>

                    <audio
                      ref={audioRef}
                      src={audioUrl || undefined}
                      onEnded={() => setIsPlaying(false)}
                      className="hidden"
                    />

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={togglePlayback}
                        className="flex-1"
                        aria-label={isPlaying ? "Pausar" : "Reproduzir"}
                      >
                        {isPlaying ? (
                          <Pause className="w-5 h-5 mr-2" />
                        ) : (
                          <Play className="w-5 h-5 mr-2" />
                        )}
                        {isPlaying ? "Pausar" : "Ouvir"}
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={deleteRecording}
                        className="text-destructive hover:text-destructive"
                        aria-label="Excluir gravação"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* Transcription Section */}
            {(isTranscribing || transcription) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="elegant-card space-y-4"
              >
                <div className="flex items-center justify-between">
                  <Label className="text-base font-medium text-slate-800">
                    Transcrição do Áudio
                  </Label>
                  {isTranscribing && (
                    <div className="flex items-center gap-2 text-primary">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Transcrevendo...</span>
                    </div>
                  )}
                </div>

                {!isTranscribing && transcription && (
                  <>
                    <Textarea
                      value={transcription}
                      onChange={(e) => setTranscription(e.target.value)}
                      className="min-h-[120px] text-base resize-none border-slate-200 bg-white text-slate-800"
                      placeholder="A transcrição aparecerá aqui..."
                    />
                    
                    <label 
                      htmlFor="confirm-transcription"
                      className="flex items-start space-x-3 p-3 bg-amber-50 border border-amber-200 rounded-xl cursor-pointer hover:bg-amber-100 active:bg-amber-150 transition-colors"
                    >
                      <Checkbox
                        id="confirm-transcription"
                        checked={isTranscriptionConfirmed}
                        onCheckedChange={(checked) => setIsTranscriptionConfirmed(checked === true)}
                      />
                      <div className="space-y-1">
                        <span className="font-medium text-slate-800">
                          Confirmo que o texto acima está correto
                        </span>
                        <p className="text-sm text-slate-600">
                          Você pode editar a transcrição antes de confirmar, se necessário.
                        </p>
                      </div>
                    </label>
                  </>
                )}
              </motion.div>
            )}

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

            <label 
              htmlFor="anonymous-audio"
              className="elegant-card flex items-start space-x-3 cursor-pointer hover:bg-slate-50 active:bg-slate-100 transition-colors"
            >
              <Checkbox
                id="anonymous-audio"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked === true)}
              />
              <div className="space-y-1">
                <span className="font-medium text-slate-800">
                  Desejo permanecer anônimo(a)
                </span>
                <p className="text-sm text-slate-600">
                  Sua identidade não será revelada no registro da manifestação.
                </p>
              </div>
            </label>

            <Button
              onClick={handleSubmit}
              size="lg"
              className="w-full text-lg h-14 transition-all duration-300 hover:shadow-lg"
              disabled={!audioBlob || !isTranscriptionConfirmed}
            >
              <Check className="w-5 h-5 mr-2" />
              Enviar Manifestação
            </Button>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
