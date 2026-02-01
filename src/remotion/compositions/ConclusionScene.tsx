import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring, useVideoConfig, Img, staticFile } from "remotion";
import { Github } from "lucide-react";

export const ConclusionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({
    frame: frame - 10,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const titleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [20, 40], [30, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.out(Easing.cubic),
  });

  const sloganOpacity = interpolate(frame, [50, 70], [0, 1], { extrapolateRight: "clamp" });
  const sloganY = interpolate(frame, [50, 70], [20, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const badgeOpacity = interpolate(frame, [80, 100], [0, 1], { extrapolateRight: "clamp" });
  const badgeScale = spring({
    frame: frame - 80,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const glowIntensity = interpolate(frame % 60, [0, 30, 60], [0.4, 0.8, 0.4]);

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, hsl(220, 30%, 5%) 0%, hsl(165, 25%, 8%) 50%, hsl(220, 30%, 10%) 100%)",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(165, 70%, 55%, 0.15) 0%, transparent 60%)",
          opacity: glowIntensity,
          filter: "blur(100px)",
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
        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            transform: `scale(${logoScale})`,
          }}
        >
          <Img
            src={staticFile("favicon.png")}
            style={{
              width: 80,
              height: 80,
            }}
          />
          <h1
            style={{
              fontSize: 64,
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

        {/* Slogan */}
        <div
          style={{
            textAlign: "center",
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <p
            style={{
              fontSize: 36,
              fontWeight: 600,
              margin: 0,
              background: "linear-gradient(135deg, hsl(165, 70%, 55%) 0%, hsl(190, 80%, 50%) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Rendre l'invisible visible
          </p>
        </div>

        <p
          style={{
            fontSize: 24,
            color: "hsl(215, 20%, 70%)",
            margin: 0,
            textAlign: "center",
            opacity: sloganOpacity,
            transform: `translateY(${sloganY}px)`,
          }}
        >
          Comprendre l'air que l'on respire, grâce à la technologie
        </p>

        {/* NSI Badge */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
            marginTop: 20,
            opacity: badgeOpacity,
            transform: `scale(${badgeScale})`,
          }}
        >
          <div
            style={{
              padding: "12px 24px",
              borderRadius: 12,
              background: "hsla(220, 60%, 50%, 0.2)",
              border: "1px solid hsla(220, 60%, 50%, 0.4)",
            }}
          >
            <span
              style={{
                fontSize: 16,
                color: "hsl(220, 60%, 70%)",
              }}
            >
              🏆 Projet présenté au Trophée NSI
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              borderRadius: 10,
              background: "hsla(220, 20%, 15%, 0.8)",
            }}
          >
            <Github size={18} color="hsl(210, 40%, 90%)" />
            <span
              style={{
                fontSize: 14,
                color: "hsl(210, 40%, 90%)",
              }}
            >
              github.com/zylowssh
            </span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
