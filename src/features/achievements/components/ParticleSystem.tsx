import { useEffect, useState, useRef, useMemo } from "react";
import type { AchievementTier } from "../types";
import type { ParticleType } from "./CelebrationOverlay";

interface ParticleSystemProps {
  particleCount: number;
  particleType: ParticleType;
  tier: AchievementTier;
}

const TIER_COLORS: Record<AchievementTier, string[]> = {
  bronze: ["#CD7F32", "#B87333", "#8B4513"],
  silver: ["#C0C0C0", "#A8A8A8", "#D3D3D3"],
  gold: ["#FFD700", "#FFC125", "#FFB90F"],
  platinum: ["#E5E4E2", "#D4D4D4", "#FFFFFF"],
};

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  velocityX: number;
  velocityY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: "circle" | "square" | "star";
}

const PARTICLE_FADE_DURATION_MS = 3000;

function createParticle(
  id: number,
  colors: string[],
  particleType: ParticleType
): Particle {
  const shapes: Array<"circle" | "square" | "star"> = ["circle", "square", "star"];
  
  const baseVelocityY = particleType === "fireworks" ? -8 : 2;
  const velocityYVariance = particleType === "fireworks" ? 4 : 3;
  
  return {
    id,
    x: Math.random() * 100,
    y: particleType === "confetti-rain" ? -10 : 50 + (Math.random() - 0.5) * 40,
    size: particleType === "sparkle" ? 4 + Math.random() * 4 : 6 + Math.random() * 6,
    color: colors[Math.floor(Math.random() * colors.length)],
    velocityX: (Math.random() - 0.5) * 4,
    velocityY: baseVelocityY + Math.random() * velocityYVariance,
    rotation: Math.random() * 360,
    rotationSpeed: (Math.random() - 0.5) * 10,
    opacity: 1,
    shape: particleType === "sparkle" ? "star" : shapes[Math.floor(Math.random() * shapes.length)],
  };
}

function ParticleShape({ particle }: { particle: Particle }) {
  const style: React.CSSProperties = {
    position: "absolute",
    left: `${particle.x}%`,
    top: `${particle.y}%`,
    width: particle.size,
    height: particle.size,
    backgroundColor: particle.shape !== "star" ? particle.color : "transparent",
    transform: `rotate(${particle.rotation}deg)`,
    opacity: particle.opacity,
    borderRadius: particle.shape === "circle" ? "50%" : "0",
    pointerEvents: "none",
  };

  if (particle.shape === "star") {
    return (
      <svg
        style={{
          ...style,
          backgroundColor: "transparent",
        }}
        viewBox="0 0 24 24"
        fill={particle.color}
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }

  return <div style={style} />;
}

export function ParticleSystem({ particleCount, particleType, tier }: ParticleSystemProps) {
  const colors = TIER_COLORS[tier];
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const initialParticles = useMemo(() => {
    return Array.from({ length: particleCount }, (_, i) =>
      createParticle(i, colors, particleType)
    );
  }, [particleCount, colors, particleType]);

  const [particles, setParticles] = useState<Particle[]>(initialParticles);

  useEffect(() => {
    startTimeRef.current = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const fadeProgress = Math.min(elapsed / PARTICLE_FADE_DURATION_MS, 1);

      setParticles((prevParticles) =>
        prevParticles.map((p) => ({
          ...p,
          x: p.x + p.velocityX * 0.1,
          y: p.y + p.velocityY * 0.1,
          velocityY: p.velocityY + 0.05,
          rotation: p.rotation + p.rotationSpeed,
          opacity: Math.max(0, 1 - fadeProgress),
        }))
      );

      if (fadeProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div 
      data-testid="particle-system"
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      {particles.map((particle) => (
        <ParticleShape key={particle.id} particle={particle} />
      ))}
    </div>
  );
}
