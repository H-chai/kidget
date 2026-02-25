import { getIconDef } from '../../constants/icons';
import type { TransactionType } from '../../types';

type Props = {
  icon: string | null | undefined;
  type: TransactionType;
  size?: number;
};

/** Renders a circular icon badge. Shows selected icon or emoji fallback. */
export const TransactionIcon = ({ icon, type, size = 36 }: Props) => {
  const def = getIconDef(icon);

  if (def) {
    const { Component, bg, color } = def;
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Component size={Math.round(size * 0.5)} color={color} />
      </div>
    );
  }

  // Fallback emoji
  return (
    <div className={`transaction-icon transaction-icon--${type}`}>
      {type === 'income' ? '⭐' : '💸'}
    </div>
  );
};
