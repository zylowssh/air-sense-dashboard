import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";
import { GraduationCap, Users, Building2 } from "lucide-react";

const useCases = [
  { icon: GraduationCap, title: "Élèves", text: "Comprendre les enjeux environnementaux", color: "hsl(165, 70%, 55%)" },
  { icon: Users, title: "Citoyens", text: "Connaître la qualité de l'air autour d'eux", color: "hsl(190, 80%, 50%)" },
  { icon: Building2, title: "Établissements", text: "Surveiller leur environnement", color: "hsl(220, 60%, 55%)" },
];

export const UseCasesScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const introOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });

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
          top: "50%",
          width: 700,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, hsla(190, 80%, 50%, 0.08) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 50,
        }}
      >
        {/* Title */}
        <div
          style={{
            textAlign: "center",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <h2
            style={{
              fontSize: 48,
              fontWeight: 700,
              margin: 0,
            }}
          >
            <span style={{ color: "hsl(210, 40%, 98%)" }}>Intérêt du </span>
            <span
              style={{
                background: "linear-gradient(135deg, hsl(165, 70%, 55%) 0%, hsl(190, 80%, 50%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Projet
            </span>
          </h2>
          <p
            style={{
              fontSize: 24,
              color: "hsl(215, 20%, 60%)",
              margin: 0,
              marginTop: 16,
              opacity: introOpacity,
            }}
          >
            Aerium peut être utilisé par :
          </p>
        </div>

        {/* Use case cards */}
        <div
          style={{
            display: "flex",
            gap: 24,
          }}
        >
          {useCases.map((useCase, index) => {
            const delay = 40 + index * 20;
            const scale = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12, stiffness: 80 },
            });
            const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const Icon = useCase.icon;

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 16,
                  padding: "32px 28px",
                  borderRadius: 20,
                  background: "hsla(220, 20%, 10%, 0.8)",
                  border: `1px solid ${useCase.color}30`,
                  transform: `scale(${scale})`,
                  opacity,
                  width: 260,
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: 18,
                    background: `${useCase.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={36} color={useCase.color} />
                </div>
                <h3
                  style={{
                    fontSize: 24,
                    fontWeight: 600,
                    color: useCase.color,
                    margin: 0,
                  }}
                >
                  {useCase.title}
                </h3>
                <span
                  style={{
                    fontSize: 16,
                    color: "hsl(215, 20%, 70%)",
                    lineHeight: 1.4,
                  }}
                >
                  {useCase.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
