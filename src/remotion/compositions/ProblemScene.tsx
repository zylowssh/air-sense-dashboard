import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";
import { AlertTriangle, MapPin, Clock } from "lucide-react";

const problems = [
  { icon: MapPin, text: "Les stations de mesure officielles sont peu nombreuses.", color: "hsl(0, 70%, 55%)" },
  { icon: Clock, text: "Les données sont difficiles à consulter et rarement en temps réel.", color: "hsl(35, 80%, 55%)" },
  { icon: AlertTriangle, text: "Il manque un outil simple, local, et compréhensible par tous.", color: "hsl(45, 90%, 55%)" },
];

export const ProblemScene: React.FC = () => {
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
        background: "linear-gradient(135deg, hsl(220, 30%, 5%) 0%, hsl(0, 20%, 8%) 50%, hsl(220, 25%, 10%) 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Red glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(0, 70%, 50%, 0.1) 0%, transparent 70%)",
          filter: "blur(100px)",
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
            color: "hsl(0, 70%, 60%)",
          }}
        >
          Le Problème
        </h2>

        {/* Problem cards */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          {problems.map((problem, index) => {
            const delay = 30 + index * 25;
            const scale = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12, stiffness: 80 },
            });
            const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });
            const Icon = problem.icon;

            return (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  padding: "24px 32px",
                  borderRadius: 16,
                  background: "hsla(220, 20%, 10%, 0.8)",
                  border: `1px solid ${problem.color}30`,
                  transform: `scale(${scale})`,
                  opacity,
                  maxWidth: 800,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${problem.color}20`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Icon size={24} color={problem.color} />
                </div>
                <span
                  style={{
                    fontSize: 22,
                    color: "hsl(210, 40%, 90%)",
                    fontWeight: 500,
                  }}
                >
                  {problem.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
