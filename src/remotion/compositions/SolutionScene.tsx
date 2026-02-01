import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring, useVideoConfig, Img, staticFile } from "remotion";

export const SolutionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Logo animation
  const logoScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  // Title animation
  const titleOpacity = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [30, 50], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Description animation
  const descOpacity = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: "clamp" });
  const descY = interpolate(frame, [60, 80], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Glow pulse
  const glowIntensity = interpolate(frame % 60, [0, 30, 60], [0.4, 0.7, 0.4]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, hsl(220, 30%, 5%) 0%, hsl(165, 25%, 8%) 50%, hsl(220, 25%, 10%) 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Green glow */}
      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(165, 70%, 55%, 0.15) 0%, transparent 60%)",
          opacity: glowIntensity,
          filter: "blur(80px)",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
        }}
      >
        {/* Intro text */}
        <p
          style={{
            fontSize: 24,
            color: "hsl(215, 20%, 60%)",
            margin: 0,
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          C'est pour répondre à ce problème que nous avons créé
        </p>

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            transform: `scale(${logoScale})`,
          }}
        >
          <Img
            src={staticFile("favicon.png")}
            style={{
              width: 100,
              height: 100,
            }}
          />
          <h1
            style={{
              fontSize: 80,
              fontWeight: 700,
              margin: 0,
            }}
          >
            <span style={{ color: "hsl(210, 40%, 98%)" }}>Aer</span>
            <span
              style={{
                background: "linear-gradient(135deg, hsl(165, 70%, 55%) 0%, hsl(190, 80%, 50%) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ium
            </span>
          </h1>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: 26,
            color: "hsl(215, 20%, 70%)",
            margin: 0,
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.5,
            opacity: descOpacity,
            transform: `translateY(${descY}px)`,
          }}
        >
          Un système permettant de collecter, traiter et visualiser
          <br />
          des données de qualité de l'air, de manière claire et accessible.
        </p>
      </div>
    </AbsoluteFill>
  );
};
