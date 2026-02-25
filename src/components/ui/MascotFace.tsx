import type { ImgHTMLAttributes } from 'react';
import faceBlue from '../../assets/mascots/face/face-blue.svg';
import faceGreen from '../../assets/mascots/face/face-green.svg';
import facePurple from '../../assets/mascots/face/face-purple.svg';
import facePink from '../../assets/mascots/face/face-pink.svg';
import faceOrange from '../../assets/mascots/face/face-orange.svg';

const FACE_MAP: Record<string, string> = {
  '#3C87D5': faceBlue,
  '#6EE057': faceGreen,
  '#A057E0': facePurple,
  '#EA60CF': facePink,
  '#F18334': faceOrange,
};

type MascotFaceProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  color?: string;
};

export const MascotFace = ({ color = '#3C87D5', ...props }: MascotFaceProps) => {
  const src = FACE_MAP[color] ?? faceBlue;
  return <img src={src} alt="" {...props} />;
};
