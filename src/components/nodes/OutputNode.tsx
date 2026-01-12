import type { Node } from '../../types';

interface OutputNodeProps {
  node: Node;
  onDragStart: (nodeId: string, e: React.MouseEvent) => void;
  onPortClick: (nodeId: string, portId: string, isOutput: boolean, position: { x: number; y: number }) => void;
  canvasOffset: { x: number; y: number };
  canvasScale: number;
  isSelected?: boolean;
}

export default function OutputNode({ node, onDragStart, onPortClick, canvasOffset, canvasScale, isSelected }: OutputNodeProps) {
  const inputPort = node.inputPorts[0];
  const isOn = inputPort?.value ?? false;

  const handlePortClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Получаем реальные координаты порта из DOM
    const portElement = e.currentTarget as HTMLElement;
    const rect = portElement.getBoundingClientRect();
    const canvas = portElement.closest('.canvas-container');
    if (!canvas) return;
    
    const canvasRect = canvas.getBoundingClientRect();
    // Центр порта в координатах канваса
    const portPosition = {
      x: (rect.left + rect.width / 2 - canvasRect.left - canvasOffset.x) / canvasScale,
      y: (rect.top + rect.height / 2 - canvasRect.top - canvasOffset.y) / canvasScale,
    };
    onPortClick(node.id, inputPort.id, false, portPosition);
  };

  return (
    <div
      className="absolute select-none"
      style={{
        left: node.position.x,
        top: node.position.y,
      }}
      onMouseDown={(e) => onDragStart(node.id, e)}
    >
      <div className={`relative group rounded-2xl transition-all ${
        isSelected ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-gray-950' : ''
      }`}>
        {/* Input порт */}
        <div
          data-port-id={inputPort.id}
          className={`absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-3 cursor-pointer transition-all duration-200 hover:scale-125 z-10 ${
            isOn
              ? 'bg-yellow-400 border-yellow-300 shadow-lg shadow-yellow-400/50'
              : 'bg-gray-600 border-gray-400 hover:bg-gray-500'
          }`}
          style={{ left: -10 }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handlePortClick}
        >
          <div className={`absolute inset-1 rounded-full ${
            isOn ? 'bg-yellow-300' : 'bg-gray-500'
          }`} />
        </div>

        {/* Тело ноды - лампочка */}
        <div
          className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
            isOn
              ? 'bg-gradient-to-br from-yellow-900/70 to-amber-800/50 border-yellow-400 shadow-xl shadow-yellow-500/30'
              : 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-600 hover:border-gray-500'
          }`}
        >
          {/* Лампочка */}
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isOn
                ? 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-lg shadow-yellow-400/60'
                : 'bg-gray-700/50'
            }`}
          >
            <svg viewBox="0 0 24 24" className="w-7 h-7">
              <path
                d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7z"
                fill={isOn ? '#fef3c7' : '#4b5563'}
              />
              <rect x="9" y="18" width="6" height="1" rx="0.5" fill={isOn ? '#fbbf24' : '#374151'} />
              <rect x="9" y="20" width="6" height="1" rx="0.5" fill={isOn ? '#fbbf24' : '#374151'} />
              <path d="M10 22h4" stroke={isOn ? '#f59e0b' : '#374151'} strokeWidth="1" strokeLinecap="round" />
            </svg>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-white font-semibold text-sm tracking-wide">OUTPUT</span>
            <span className={`text-xs font-medium ${
              isOn ? 'text-yellow-400' : 'text-gray-500'
            }`}>
              {isOn ? 'ON' : 'OFF'}
            </span>
          </div>
          
          {/* Индикатор статуса */}
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
            isOn 
              ? 'bg-yellow-400 shadow-md shadow-yellow-400/50 animate-pulse' 
              : 'bg-gray-600'
          }`} />
        </div>
      </div>
    </div>
  );
}
