import type { Node } from '../../types';

interface XorNodeProps {
  node: Node;
  onDragStart: (nodeId: string, e: React.MouseEvent) => void;
  onPortClick: (nodeId: string, portId: string, isOutput: boolean, position: { x: number; y: number }) => void;
  canvasOffset: { x: number; y: number };
  canvasScale: number;
  isSelected?: boolean;
}

export default function XorNode({ node, onDragStart, onPortClick, canvasOffset, canvasScale, isSelected }: XorNodeProps) {
  const inputPorts = node.inputPorts;
  const outputPort = node.outputPorts[0];

  // Логика XOR: нечетное количество true входов
  const isActive = inputPorts.filter(port => port.value).length % 2 === 1;
  const outputValue = isActive;

  const handlePortClick = (e: React.MouseEvent, portId: string, isOutput: boolean) => {
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
    onPortClick(node.id, portId, isOutput, portPosition);
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
        {/* Тело ноды */}
        <div
          className={`flex items-center gap-3 px-5 py-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm ${
            isActive
              ? 'bg-gradient-to-br from-cyan-900/70 to-cyan-800/50 border-cyan-400 shadow-xl shadow-cyan-500/30'
              : 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-600 hover:border-gray-500'
          }`}
        >
          {/* Иконка */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isActive ? 'bg-cyan-500/30' : 'bg-gray-700/50'
          }`}>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={isActive ? '#06b6d4' : '#9ca3af'} strokeWidth="2">
              <path d="M7 12h10M7 8h10M7 16h10" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-white font-semibold text-sm tracking-wide">XOR</span>
            <span className={`text-xs font-medium ${
              isActive ? 'text-cyan-400' : 'text-gray-500'
            }`}>
              {isActive ? 'TRUE' : 'FALSE'}
            </span>
          </div>

          {/* Индикатор статуса */}
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
            isActive
              ? 'bg-cyan-400 shadow-md shadow-cyan-400/50 animate-pulse'
              : 'bg-gray-600'
          }`} />
        </div>

        {/* Input порты */}
        {inputPorts.map((port, index) => (
          <div
            key={port.id}
            data-port-id={port.id}
            className={`absolute left-0 w-5 h-5 rounded-full border-3 cursor-pointer transition-all duration-200 hover:scale-125 z-10 ${
              port.value
                ? 'bg-cyan-400 border-cyan-300 shadow-lg shadow-cyan-400/50'
                : 'bg-gray-600 border-gray-400 hover:bg-gray-500'
            }`}
            style={{
              left: -10,
              top: `${(index + 1) * 100 / (inputPorts.length + 1)}%`,
              transform: 'translateY(-50%)'
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => handlePortClick(e, port.id, false)}
          >
            <div className={`absolute inset-1 rounded-full ${
              port.value ? 'bg-cyan-300' : 'bg-gray-500'
            }`} />
          </div>
        ))}

        {/* Output порт */}
        <div
          data-port-id={outputPort.id}
          className={`absolute right-0 top-1/2 w-5 h-5 rounded-full border-3 cursor-pointer transition-all duration-200 hover:scale-125 z-10 ${
            outputValue
              ? 'bg-cyan-400 border-cyan-300 shadow-lg shadow-cyan-400/50'
              : 'bg-gray-600 border-gray-400 hover:bg-gray-500'
          }`}
          style={{ right: -14, transform: 'translateY(-50%)' }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => handlePortClick(e, outputPort.id, true)}
        >
          <div className={`absolute inset-1 rounded-full ${
            outputValue ? 'bg-cyan-300' : 'bg-gray-500'
          }`} />
        </div>
      </div>
    </div>
  );
}
