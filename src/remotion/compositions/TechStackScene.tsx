import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";
import { Database, Cpu, BarChart3, Radio } from "lucide-react";

const architectureElements = [
  { name: "Capteurs", description: "Réception des données", icon: Radio, color: "hsl(165, 70%, 55%)" },
  { name: "Traitement", description: "Analyse en temps réel", icon: Cpu, color: "hsl(200, 80%, 55%)" },
  { name: "Stockage", description: "Conservation de l'historique", icon: Database, color: "hsl(260, 60%, 60%)" },
  { name: "Interface", description: "Lecture instantanée", icon: BarChart3, color: "hsl(45, 90%, 55%)" },
];

export const TechStackScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [0, 20], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });

  // Connection line animation
  const lineProgress = interpolate(frame, [80, 140], [0, 100], { 
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp" 
  });

  const conclusionOpacity = interpolate(frame, [140, 160], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, hsl(220, 30%, 5%) 0%, hsl(220, 30%, 10%) 50%, hsl(200, 25%, 8%) 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "20%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(220, 60%, 50%, 0.08) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
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
            <span style={{ color: "hsl(210, 40%, 98%)" }}>Architecture </span>
            <span
              style={{
                background: "linear-gradient(135deg, hsl(165, 70%, 55%) 0%, hsl(190, 80%, 50%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Technique
            </span>
          </h2>
          <p
            style={{
              fontSize: 22,
              color: "hsl(215, 20%, 60%)",
              margin: 0,
              marginTop: 12,
              opacity: subtitleOpacity,
            }}
          >
            Une architecture complète pour faire fonctionner Aerium
          </p>
        </div>

        {/* Architecture diagram */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            position: "relative",
          }}
        >
          {architectureElements.map((element, index) => {
            const delay = 40 + index * 15;
            const scale = spring({
              frame: frame - delay,
              fps,
              config: { damping: 12, stiffness: 80 },
            });
            const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            });

            const IconComponent = element.icon;

            return (
              <div key={element.name} style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 12,
                    padding: "24px 20px",
                    borderRadius: 16,
                    background: "hsla(220, 20%, 10%, 0.9)",
                    border: `1px solid ${element.color}40`,
                    backdropFilter: "blur(10px)",
                    transform: `scale(${scale})`,
                    opacity,
                    width: 160,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 14,
                      background: `${element.color}20`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <IconComponent size={28} color={element.color} />
                  </div>
                  <span
                    style={{
                      fontSize: 20,
                      fontWeight: 600,
                      color: element.color,
                    }}
                  >
                    {element.name}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      color: "hsl(215, 20%, 60%)",
                      lineHeight: 1.3,
                    }}
                  >
                    {element.description}
                  </span>
                </div>
                {/* Connector arrow */}
                {index < architectureElements.length - 1 && (
                  <div
                    style={{
                      width: 40,
                      height: 2,
                      background: `linear-gradient(90deg, ${element.color}80, ${architectureElements[index + 1].color}80)`,
                      marginLeft: 10,
                      marginRight: 10,
                      opacity: lineProgress > (index + 1) * 25 ? 1 : 0,
                      transition: "opacity 0.3s",
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Conclusion text */}
        <p
          style={{
            fontSize: 20,
            color: "hsl(215, 20%, 65%)",
            textAlign: "center",
            maxWidth: 800,
            margin: 0,
            marginTop: 10,
            opacity: conclusionOpacity,
            lineHeight: 1.5,
          }}
        >
          Chaque élément communique pour transformer
          <br />
          <span style={{ color: "hsl(165, 70%, 55%)" }}>des mesures brutes en informations compréhensibles</span>
        </p>
      </div>
    </AbsoluteFill>
  );
};
