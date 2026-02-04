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
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  const currentComposition = compositions.find((c) => c.id === activeScene) || compositions[0];

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
    <section className="min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 bg-muted/30">
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

        {/* Video player */}
        <div className="rounded-2xl overflow-hidden border border-border shadow-2xl bg-card">
          <div className="aspect-video">
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
          </div>
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
