import React from 'react';
import brasaoImage from '../assets/images/brasao_pmpe_oficial_1791984369955.jpg';

interface BrasaoPmpeProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'header' | 'avatar';
  alt?: string;
}

export const BrasaoPmpe: React.FC<BrasaoPmpeProps> = ({
  className = '',
  size = 'md',
  alt = 'Brasão Oficial CEaD • DEIP - Coordenação de Ensino a Distância PMPE',
}) => {
  const sizeMap = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    avatar: 'w-8 h-8',
    md: 'w-10 h-10',
    header: 'w-14 h-14',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  const dimClass = sizeMap[size] || sizeMap.md;

  return (
    <img
      src={brasaoImage}
      alt={alt}
      referrerPolicy="no-referrer"
      className={`object-contain shrink-0 select-none ${dimClass} ${className}`}
      style={{
        imageRendering: '-webkit-optimize-contrast',
      }}
      loading="eager"
      decoding="async"
    />
  );
};
