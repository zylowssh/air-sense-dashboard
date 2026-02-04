import { Player } from "@remotion/player";
import { AeriumVideo, AERIUM_VIDEO_DURATION } from "@/remotion/AeriumVideo";
import { IntroductionScene } from "@/remotion/compositions/IntroductionScene";
import { ProblemScene } from "@/remotion/compositions/ProblemScene";
import { SolutionScene } from "@/remotion/compositions/SolutionScene";
import { ObjectiveScene } from "@/remotion/compositions/ObjectiveScene";
import { HowItWorksScene } from "@/remotion/compositions/HowItWorksScene";
import { FeaturesScene } from "@/remotion/compositions/FeaturesScene";
import { TechStackScene } from "@/remotion/compositions/TechStackScene";
import { UseCasesScene } from "@/remotion/compositions/UseCasesScene";
import { ConclusionScene } from "@/remotion/compositions/ConclusionScene";
import { DatabaseSchemaScene } from "@/remotion/compositions/DatabaseSchemaScene";
import { BackendArchitectureScene } from "@/remotion/compositions/BackendArchitectureScene";
import { useState, forwardRef, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Download, Copy, Check } from "lucide-react";

const compositions = [
  { id: "full", label: "Vidéo Complète", frames: AERIUM_VIDEO_DURATION, component: AeriumVideo },
  { id: "introduction", label: "Introduction", frames: 180, component: IntroductionScene },
  { id: "problem", label: "Le Problème", frames: 150, component: ProblemScene },
  { id: "solution", label: "La Solution", frames: 180, component: SolutionScene },
  { id: "objective", label: "Objectif", frames: 150, component: ObjectiveScene },
  { id: "how-it-works", label: "Fonctionnement", frames: 180, component: HowItWorksScene },
  { id: "features", label: "Fonctionnalités", frames: 150, component: FeaturesScene },
  { id: "database", label: "Base de Données", frames: 180, component: DatabaseSchemaScene },
  { id: "backend", label: "Backend", frames: 180, component: BackendArchitectureScene },
  { id: "tech-stack", label: "Technique", frames: 180, component: TechStackScene },
  { id: "use-cases", label: "Cas d'Usage", frames: 150, component: UseCasesScene },
  { id: "conclusion", label: "Conclusion", frames: 180, component: ConclusionScene },
];

const VideoSection = forwardRef<HTMLDivElement>((props, ref) => {
  const [activeScene, setActiveScene] = useState("full");
  const [showExportModal, setShowExportModal] = useState(false);
  const [copiedCommand, setCopiedCommand] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const currentComposition = compositions.find((c) => c.id === activeScene) || compositions[0];

  // Intersection Observer to detect when section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const copyExportCommand = async (command: string) => {
    await navigator.clipboard.writeText(command);
    setCopiedCommand(true);
    setTimeout(() => setCopiedCommand(false), 2000);
  };

  const exportCommands = {
    full: "npx remotion render src/remotion/index.ts AeriumVideo out/aerium-video.mp4",
    scene: `npx remotion render src/remotion/index.ts ${activeScene} out/${activeScene}.mp4`,
  };

  // Expose scroll target through ref
  useEffect(() => {
    if (ref && typeof ref === 'object' && 'current' in ref) {
      ref.current = scrollTargetRef.current;
    }
  }, [ref]);

  return (
    <section ref={sectionRef} className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div ref={scrollTargetRef} className="w-full max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Découvrez Aerium en Action
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visualisez comment notre technologie surveille et analyse la qualité de l'air en temps réel.
          </p>
        </div>

        {/* Controls - Commented out for now */}

        {/* Scene selector */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {compositions.map((comp) => (
            <button
              key={comp.id}
              onClick={() => setActiveScene(comp.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                activeScene === comp.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              {comp.label}
            </button>
          ))}
        </div>

        {/* Video player with pronounced depth effect */}
        <div ref={videoContainerRef} className="relative mb-8">
          {/* Far background depth layer - cyan/blue glow */}
          <motion.div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-accent/15 to-primary/20 blur-3xl -z-30 scale-125"
            initial={{ opacity: 0, scale: 1.1 }}
            whileInView={{ opacity: 0.8, scale: 1.25 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8 }}
          />
          
          {/* Mid background depth layer - accent/purple glow */}
          <motion.div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-tl from-accent/15 via-primary/10 to-accent/15 blur-2xl -z-20 scale-110"
            initial={{ opacity: 0, scale: 1.05 }}
            whileInView={{ opacity: 0.6, scale: 1.15 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          />
          
          {/* Foreground depth layer - primary/accent */}
          <motion.div 
            className="absolute inset-0 rounded-2xl bg-gradient-to-t from-primary/10 to-transparent blur-xl -z-10 scale-105"
            initial={{ opacity: 0, scale: 1.02 }}
            whileInView={{ opacity: 0.5, scale: 1.08 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />

          {/* Main video player container */}
          <motion.div 
            className="rounded-2xl overflow-hidden border border-border/80 shadow-2xl bg-card relative z-10"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="aspect-video">
              {isInView && (
                <Player
                  key={activeScene}
                  component={currentComposition.component}
                  durationInFrames={currentComposition.frames}
                  fps={30}
                  compositionWidth={1920}
                  compositionHeight={1080}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                  controls
                  loop
                  autoPlay
                />
              )}
              {!isInView && (
                <div className="w-full h-full bg-card/50 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-muted-foreground">Vidéo en attente...</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Info */}
        <div className="text-center space-y-2 mt-8">
          <p className="text-sm text-muted-foreground">
            {currentComposition.frames} frames @ 30fps = {(currentComposition.frames / 30).toFixed(1)}s
          </p>
          <p className="text-xs text-muted-foreground/60">
            Projet Aerium - Qualité de l'air IoT | Trophée NSI
          </p>
        </div>
      </div>
    </section>
  );
});

VideoSection.displayName = 'VideoSection';

export default VideoSection;
