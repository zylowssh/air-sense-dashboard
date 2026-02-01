import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";

export const IntroductionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Question animation
  const questionOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const questionY = interpolate(frame, [0, 30], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Answer animation
  const answerOpacity = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: "clamp" });
  const answerY = interpolate(frame, [60, 90], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  // Floating particles
  const particles = [...Array(15)].map((_, i) => {
    const particleDelay = i * 4;
    const particleY = interpolate(
      (frame + particleDelay) % 180,
      [0, 180],
      [110, -10],
      { extrapolateRight: "clamp" }
    );
    return { x: (i * 73) % 100, y: particleY, size: 3 + (i % 4) * 2 };
  });

  // Glow effect
  const glowOpacity = interpolate(frame % 90, [0, 45, 90], [0.2, 0.5, 0.2]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, hsl(220, 30%, 5%) 0%, hsl(180, 25%, 8%) 50%, hsl(220, 25%, 10%) 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            backgroundColor: `hsla(165, 70%, 55%, 0.4)`,
          }}
        />
      ))}

      {/* Central glow */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(165, 70%, 55%, 0.2) 0%, transparent 70%)",
          opacity: glowOpacity,
          filter: "blur(80px)",
        }}
      />

      {/* Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
          maxWidth: 1200,
          padding: 60,
          textAlign: "center",
        }}
      >
        {/* Question */}
        <h1
          style={{
            fontSize: 56,
            fontWeight: 700,
            margin: 0,
            opacity: questionOpacity,
            transform: `translateY(${questionY}px)`,
            background: "linear-gradient(135deg, hsl(165, 70%, 55%) 0%, hsl(190, 80%, 50%) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Et si nous pouvions voir l'air que nous respirons ?
        </h1>

        {/* Answer */}
        <p
          style={{
            fontSize: 28,
            color: "hsl(215, 20%, 70%)",
            margin: 0,
            lineHeight: 1.6,
            opacity: answerOpacity,
            transform: `translateY(${answerY}px)`,
          }}
        >
          La qualité de l'air influence notre santé, notre environnement, et notre quotidien.
          <br />
          <span style={{ color: "hsl(215, 20%, 50%)" }}>
            Pourtant, ces données restent souvent invisibles, complexes, ou inaccessibles.
          </span>
        </p>
      </div>
    </AbsoluteFill>
  );
};
