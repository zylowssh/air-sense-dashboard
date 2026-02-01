import { AbsoluteFill, useCurrentFrame, interpolate, Easing, spring, useVideoConfig } from "remotion";
import { Activity, Clock, MapPin, Smartphone } from "lucide-react";

const features = [
  { icon: Activity, title: "Mesures en temps réel", color: "hsl(165, 70%, 55%)" },
  { icon: Clock, title: "Historique des données", color: "hsl(190, 80%, 50%)" },
  { icon: MapPin, title: "Comparaison entre lieux", color: "hsl(220, 60%, 55%)" },
  { icon: Smartphone, title: "Interface intuitive", color: "hsl(260, 60%, 55%)" },
];

const FeatureCard: React.FC<{
  feature: typeof features[0];
  index: number;
  frame: number;
  fps: number;
}> = ({ feature, index, frame, fps }) => {
  const delay = index * 15;
  const Icon = feature.icon;

  const scale = spring({
    frame: frame - delay,
    fps,
    config: { damping: 12, stiffness: 80 },
  });

  const opacity = interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const row = Math.floor(index / 2);
  const col = index % 2;
  const x = (col - 0.5) * 320;
  const y = (row - 0.5) * 180;

  return (
    <div
      style={{
        position: "absolute",
        left: "50%",
        top: "55%",
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`,
        opacity,
        width: 280,
        padding: 24,
        borderRadius: 20,
        background: "hsla(220, 20%, 10%, 0.8)",
        border: `1px solid ${feature.color}30`,
        backdropFilter: "blur(20px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 14,
          background: `${feature.color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Icon size={28} color={feature.color} />
      </div>
      <span
        style={{
          fontSize: 18,
          fontWeight: 600,
          color: "hsl(210, 40%, 98%)",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {feature.title}
      </span>
    </div>
  );
};

export const FeaturesScene: React.FC = () => {
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
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "30%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsla(165, 70%, 55%, 0.1) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      {/* Title */}
      <h2
        style={{
          position: "absolute",
          top: 80,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 48,
          fontWeight: 700,
          margin: 0,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
        }}
      >
        <span style={{ color: "hsl(210, 40%, 98%)" }}>Fonctionnalités </span>
        <span
          style={{
            background: "linear-gradient(135deg, hsl(165, 70%, 55%) 0%, hsl(190, 80%, 50%) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Principales
        </span>
      </h2>

      {/* Feature cards */}
      <div style={{ position: "absolute", inset: 0 }}>
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            feature={feature}
            index={index}
            frame={frame - 30}
            fps={fps}
          />
        ))}
      </div>
    </AbsoluteFill>
  );
};
