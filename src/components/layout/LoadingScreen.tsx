import { useTranslation } from 'react-i18next';
import facePlainBlue from '../../assets/mascots/face/face-plain-blue.svg';
import facePlainGreen from '../../assets/mascots/face/face-plain-green.svg';
import facePlainPurple from '../../assets/mascots/face/face-plain-purple.svg';
import facePlainPink from '../../assets/mascots/face/face-plain-pink.svg';
import facePlainOrange from '../../assets/mascots/face/face-plain-orange.svg';

const FACE_PLAIN_MAP: Record<string, string> = {
  '#3C87D5': facePlainBlue,
  '#6EE057': facePlainGreen,
  '#A057E0': facePlainPurple,
  '#EA60CF': facePlainPink,
  '#F18334': facePlainOrange,
};

const STORAGE_COLOR_KEY = 'kidget:userColor';

export const LoadingScreen = () => {
  const { t } = useTranslation();
  const color = localStorage.getItem(STORAGE_COLOR_KEY) ?? '#3C87D5';
  const src = FACE_PLAIN_MAP[color] ?? facePlainBlue;

  return (
    <div className="loading-screen">
      <img src={src} alt="" className="loading-face" />
      <p className="loading-text">{t('common.loading')}</p>
    </div>
  );
};
