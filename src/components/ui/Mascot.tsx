import type { ImgHTMLAttributes } from 'react';
import mascotBlue from '../../assets/mascots/mascot-blue.svg';
import mascotGreen from '../../assets/mascots/mascot-green.svg';
import mascotPurple from '../../assets/mascots/mascot-purple.svg';
import mascotPink from '../../assets/mascots/mascot-pink.svg';
import mascotOrange from '../../assets/mascots/mascot-orange.svg';

const MASCOT_MAP: Record<string, string> = {
  '#3C87D5': mascotBlue,
  '#6EE057': mascotGreen,
  '#A057E0': mascotPurple,
  '#EA60CF': mascotPink,
  '#F18334': mascotOrange,
};

type MascotProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  color?: string;
};

export const Mascot = ({ color = '#3C87D5', ...props }: MascotProps) => {
  const src = MASCOT_MAP[color] ?? mascotBlue;
  return <img src={src} alt="" {...props} />;
};
