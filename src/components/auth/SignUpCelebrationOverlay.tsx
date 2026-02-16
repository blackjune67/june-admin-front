import { useMemo, type CSSProperties } from "react";
import { useLocale } from "../../context/LocaleContext";

type SignUpCelebrationOverlayProps = {
  name: string;
};

type ConfettiPiece = {
  id: number;
  left: string;
  delay: string;
  duration: string;
  width: number;
  height: number;
  drift: string;
  color: string;
};

const COLORS = ["#465fff", "#12b76a", "#f79009", "#ee46bc", "#36bffa", "#fb6514"];

const random = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

export default function SignUpCelebrationOverlay({
  name,
}: SignUpCelebrationOverlayProps) {
  const { t } = useLocale();
  const confettiPieces = useMemo<ConfettiPiece[]>(
    () =>
      Array.from({ length: 110 }, (_, index) => {
        const sizeSeed = random(index + 1);
        const width = 6 + Math.round(sizeSeed * 8);
        const height = Math.max(4, Math.round(width * 0.6));

        return {
          id: index,
          left: `${Math.round(random(index + 2) * 100)}%`,
          delay: `${(random(index + 3) * 0.85).toFixed(2)}s`,
          duration: `${(2.1 + random(index + 4) * 1.8).toFixed(2)}s`,
          width,
          height,
          drift: `${Math.round((random(index + 5) - 0.5) * 260)}px`,
          color: COLORS[index % COLORS.length],
        };
      }),
    [],
  );

  return (
    <div className="signup-celebration-overlay">
      <div className="signup-celebration-backdrop" />

      <div className="signup-celebration-firework signup-celebration-firework-left" />
      <div className="signup-celebration-firework signup-celebration-firework-center" />
      <div className="signup-celebration-firework signup-celebration-firework-right" />

      <div className="signup-celebration-card">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand-200 uppercase">
          {t("auth.celebration.badge")}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
          {t("auth.celebration.welcome", { name })}
        </h2>
        <p className="mt-3 text-sm text-blue-light-100 sm:text-base">
          {t("auth.celebration.message")}
        </p>
      </div>

      {confettiPieces.map((piece) => (
        <span
          key={piece.id}
          className="signup-confetti-piece"
          style={{
            left: piece.left,
            width: `${piece.width}px`,
            height: `${piece.height}px`,
            backgroundColor: piece.color,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            "--confetti-drift": piece.drift,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}
