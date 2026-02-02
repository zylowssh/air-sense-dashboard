import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";
import { Cpu, Server, Monitor, ArrowRight } from "lucide-react";

const steps = [
  { icon: Cpu, text: "Des capteurs mesurent la qualité de l'air", color: "hsl(165, 70%, 55%)" },
  { icon: Server, text: "Les données sont envoyées vers un serveur", color: "hsl(190, 80%, 50%)" },
  { icon: Monitor, text: "Affichées en temps réel sur une interface claire", color: "hsl(220, 60%, 55%)" },
];

export const HowItWorksScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Arrow animation
  const arrowProgress = interpolate(frame, [80, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, hsl(220, 30%, 5%) 0%, hsl(220, 30%, 10%) 50%, hsl(200, 25%, 8%) 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, hsla(190, 80%, 50%, 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 60,
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            margin: 0,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <span style={{ color: "hsl(210, 40%, 98%)" }}>Comment </span>
          <span
            style={{
              background: "linear-gradient(135deg, hsl(165, 70%, 55%) 0%, hsl(190, 80%, 50%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            ça fonctionne
          </span>
        </h2>

        {/* Steps in a row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
          }}
        >
          {steps.map((step, index) => {
            const delay = 30 + index * 30;
            const scale = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12, stiffness: 80 },
            });
            const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const Icon = step.icon;

            return (
              <div key={index}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 16,
                    padding: "28px 24px",
                    borderRadius: 20,
                    background: "hsla(220, 20%, 10%, 0.8)",
                    border: `1px solid ${step.color}30`,
                    transform: `scale(${scale})`,
                    opacity,
                    width: 240,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: 16,
                      background: `${step.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon size={32} color={step.color} />
                  </div>
                  <span
                    style={{
                      fontSize: 18,
                      color: "hsl(210, 40%, 90%)",
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {step.text}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight
                    size={32}
                    color={`hsla(165, 70%, 55%, ${arrowProgress})`}
                    style={{
                      opacity: arrowProgress,
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
