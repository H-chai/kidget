import './ui.css';

type ProgressBarProps = {
  value: number; // 0–100
  color?: string;
};

export const ProgressBar = ({ value, color = '#6366f1' }: ProgressBarProps) => (
  <div className="progress-track">
    <div
      className="progress-fill"
      style={{
        width: `${Math.min(100, Math.max(0, value))}%`,
        background: color,
      }}
    />
  </div>
);
