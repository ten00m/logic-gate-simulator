interface ConnectionLineProps {
  from: { x: number; y: number };
  to: { x: number; y: number };
  isActive?: boolean;
  isPending?: boolean;
  onClick?: () => void;
}

export default function ConnectionLine({
  from,
  to,
  isActive = false,
  isPending = false,
  onClick,
}: ConnectionLineProps) {
  // Вычисляем контрольные точки для Bezier-кривой
  const dx = to.x - from.x;
  const controlOffset = Math.min(Math.abs(dx) * 0.5, 100);
  
  // Контрольные точки для плавной кривой
  const cp1x = from.x + controlOffset;
  const cp1y = from.y;
  const cp2x = to.x - controlOffset;
  const cp2y = to.y;

  const pathD = `M ${from.x} ${from.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${to.x} ${to.y}`;

  // Цвета в зависимости от состояния
  const strokeColor = isPending
    ? '#60a5fa' // blue-400
    : isActive
    ? '#22c55e' // green-500
    : '#4b5563'; // gray-600

  const glowColor = isActive ? '#22c55e' : 'transparent';

  return (
    <g className="cursor-pointer" onClick={onClick}>
      {/* Glow эффект для активных соединений */}
      {isActive && (
        <path
          d={pathD}
          fill="none"
          stroke={glowColor}
          strokeWidth={8}
          strokeLinecap="round"
          opacity={0.3}
        />
      )}
      
      {/* Основная линия (толстая для клика) */}
      <path
        d={pathD}
        fill="none"
        stroke="transparent"
        strokeWidth={12}
        strokeLinecap="round"
      />
      
      {/* Видимая линия */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth={3}
        strokeLinecap="round"
        className={`transition-colors ${isPending ? 'stroke-dasharray-4' : ''}`}
        style={{
          strokeDasharray: isPending ? '8 4' : 'none',
          animation: isPending ? 'dash 0.5s linear infinite' : 'none',
        }}
      />
      
      {/* Точка на конце при pending */}
      {isPending && (
        <circle
          cx={to.x}
          cy={to.y}
          r={6}
          fill="#60a5fa"
          className="animate-pulse"
        />
      )}
    </g>
  );
}
