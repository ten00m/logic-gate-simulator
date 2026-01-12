import type { Node } from '../../types';

interface NotNodeProps {
  node: Node;
  onDragStart: (nodeId: string, e: React.MouseEvent) => void;
  onPortClick: (nodeId: string, portId: string, isOutput: boolean, position: { x: number; y: number }) => void;
  canvasOffset: { x: number; y: number };
  canvasScale: number;
  isSelected?: boolean;
}

export default function NotNode({ node, onDragStart, onPortClick, canvasOffset, canvasScale, isSelected }: NotNodeProps) {
  const inputPort = node.inputPorts[0];
  const outputPort = node.outputPorts[0];

  // Логика NOT: инвертируем значение входа
  const inputValue = inputPort?.value ?? false;
  const outputValue = !inputValue;

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
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all duration-300 backdrop-blur-sm ${
            outputValue
              ? 'bg-gradient-to-br from-blue-900/70 to-blue-800/50 border-blue-400 shadow-xl shadow-blue-500/30'
              : 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-600 hover:border-gray-500'
          }`}
        >
          {/* Иконка */}
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
            outputValue ? 'bg-blue-500/30' : 'bg-gray-700/50'
          }`}>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke={outputValue ? '#3b82f6' : '#9ca3af'} strokeWidth="2.5">
              <circle cx="12" cy="12" r="8"/>
              <text x="6" y="15" fontSize="8" fill={outputValue ? '#3b82f6' : '#9ca3af'} fontWeight="bold">NOT</text>
            </svg>
          </div>

          <div className="flex flex-col gap-0.5">
            <span className="text-white font-semibold text-sm">NOT</span>
            <span className={`text-xs font-medium ${
              outputValue ? 'text-blue-400' : 'text-gray-500'
            }`}>
              {outputValue ? 'TRUE' : 'FALSE'}
            </span>
          </div>

          {/* Индикатор статуса */}
          <div className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            outputValue
              ? 'bg-blue-400 shadow-md shadow-blue-400/50 animate-pulse'
              : 'bg-gray-600'
          }`} />
        </div>

        {/* Input порт */}
        <div
          key={inputPort?.id}
          data-port-id={inputPort?.id}
          className={`absolute left-0 w-5 h-5 rounded-full border-3 cursor-pointer transition-all duration-200 hover:scale-125 z-10 ${
            inputValue
              ? 'bg-blue-400 border-blue-300 shadow-lg shadow-blue-400/50'
              : 'bg-gray-600 border-gray-400 hover:bg-gray-500'
          }`}
          style={{
            left: -10,
            top: '50%',
            transform: 'translateY(-50%)'
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => handlePortClick(e, inputPort?.id || '', false)}
        >
          <div className={`absolute inset-1 rounded-full ${
            inputValue ? 'bg-blue-300' : 'bg-gray-500'
          }`} />
        </div>

        {/* Output порт */}
        <div
          data-port-id={outputPort?.id}
          className={`absolute right-0 top-1/2 w-5 h-5 rounded-full border-3 cursor-pointer transition-all duration-200 hover:scale-125 z-10 ${
            outputValue
              ? 'bg-blue-400 border-blue-300 shadow-lg shadow-blue-400/50'
              : 'bg-gray-600 border-gray-400 hover:bg-gray-500'
          }`}
          style={{ right: -14, transform: 'translateY(-50%)' }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => handlePortClick(e, outputPort?.id || '', true)}
        >
          <div className={`absolute inset-1 rounded-full ${
            outputValue ? 'bg-blue-300' : 'bg-gray-500'
          }`} />
        </div>
      </div>
    </div>
  );
}
