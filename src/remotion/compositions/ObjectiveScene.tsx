import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";
import { Eye, Users, GitBranch } from "lucide-react";

const objectives = [
  { icon: Eye, text: "Rendre visibles des données invisibles", color: "hsl(165, 70%, 55%)" },
  { icon: Users, text: "Permettre à chacun de comprendre l'environnement qui l'entoure", color: "hsl(190, 80%, 50%)" },
  { icon: GitBranch, text: "Proposer une solution open-source, modulaire et évolutive", color: "hsl(220, 60%, 55%)" },
];

export const ObjectiveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
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
          top: "40%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(165, 70%, 55%, 0.1) 0%, transparent 70%)",
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
        <h2
          style={{
            fontSize: 48,
            fontWeight: 700,
            margin: 0,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <span style={{ color: "hsl(210, 40%, 98%)" }}>Objectif du </span>
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

        {/* Objectives */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {objectives.map((obj, index) => {
            const delay = 30 + index * 20;
            const scale = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12, stiffness: 80 },
            });
            const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const Icon = obj.icon;

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "20px 28px",
                  borderRadius: 16,
                  background: "hsla(220, 20%, 10%, 0.8)",
                  border: `1px solid ${obj.color}30`,
                  transform: `scale(${scale})`,
                  opacity,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${obj.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} color={obj.color} />
                </div>
                <span
                  style={{
                    fontSize: 22,
                    color: "hsl(210, 40%, 90%)",
                    fontWeight: 500,
                  }}
                >
                  {obj.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
