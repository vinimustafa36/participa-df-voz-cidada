import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import HomeScreen from "@/components/screens/HomeScreen";
import TextManifestationScreen from "@/components/screens/TextManifestationScreen";
import AudioManifestationScreen from "@/components/screens/AudioManifestationScreen";
import MediaManifestationScreen from "@/components/screens/MediaManifestationScreen";
import SuccessScreen from "@/components/screens/SuccessScreen";
import TrackingScreen from "@/components/screens/TrackingScreen";
import { saveManifestation, ManifestationType } from "@/lib/manifestation";

type AppScreen = "home" | "text" | "audio" | "media" | "success" | "tracking";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("home");
  const [protocolNumber, setProtocolNumber] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const handleSelectType = (type: ManifestationType | "tracking") => {
    if (type === "tracking") {
      setCurrentScreen("tracking");
    } else {
      setCurrentScreen(type);
    }
  };

  const handleBack = () => {
    setCurrentScreen("home");
  };

  const handleTextSubmit = (data: { 
    content: string; 
    isAnonymous: boolean;
    email?: string;
    name?: string;
  }) => {
    const manifestation = saveManifestation({
      type: "text",
      content: data.content,
      isAnonymous: data.isAnonymous,
      email: data.email,
      name: data.name,
    });
    setProtocolNumber(manifestation.protocol);
    setUserEmail(data.email || "");
    setCurrentScreen("success");
  };

  const handleAudioSubmit = (data: { 
    audioBlob: Blob; 
    isAnonymous: boolean;
    email?: string;
    name?: string;
  }) => {
    const manifestation = saveManifestation({
      type: "audio",
      audioBlob: data.audioBlob,
      isAnonymous: data.isAnonymous,
      email: data.email,
      name: data.name,
    });
    setProtocolNumber(manifestation.protocol);
    setUserEmail(data.email || "");
    setCurrentScreen("success");
  };

  const handleMediaSubmit = (data: {
    file: File;
    description: string;
    isAnonymous: boolean;
    email?: string;
    name?: string;
  }) => {
    const manifestation = saveManifestation({
      type: "media",
      mediaFile: data.file,
      mediaDescription: data.description,
      isAnonymous: data.isAnonymous,
      email: data.email,
      name: data.name,
    });
    setProtocolNumber(manifestation.protocol);
    setUserEmail(data.email || "");
    setCurrentScreen("success");
  };

  const handleGoHome = () => {
    setCurrentScreen("home");
    setProtocolNumber("");
    setUserEmail("");
  };

  return (
    <div className="app-intro">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScreen}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          {currentScreen === "home" && (
            <HomeScreen onSelectType={handleSelectType} />
          )}
          {currentScreen === "text" && (
            <TextManifestationScreen onBack={handleBack} onSubmit={handleTextSubmit} />
          )}
          {currentScreen === "audio" && (
            <AudioManifestationScreen onBack={handleBack} onSubmit={handleAudioSubmit} />
          )}
          {currentScreen === "media" && (
            <MediaManifestationScreen onBack={handleBack} onSubmit={handleMediaSubmit} />
          )}
          {currentScreen === "success" && (
            <SuccessScreen 
              protocolNumber={protocolNumber} 
              userEmail={userEmail}
              onGoHome={handleGoHome} 
            />
          )}
          {currentScreen === "tracking" && (
            <TrackingScreen onBack={handleBack} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Index;
