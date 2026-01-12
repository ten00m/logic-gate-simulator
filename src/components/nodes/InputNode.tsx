import type { Node } from '../../types';

interface InputNodeProps {
  node: Node;
  onDragStart: (nodeId: string, e: React.MouseEvent) => void;
  onPortClick: (nodeId: string, portId: string, isOutput: boolean, position: { x: number; y: number }) => void;
  onToggle: (value: boolean) => void;
  canvasOffset: { x: number; y: number };
  canvasScale: number;
  isSelected?: boolean;
}

export default function InputNode({ node, onDragStart, onPortClick, onToggle, canvasOffset, canvasScale, isSelected }: InputNodeProps) {
  const isOn = node.value ?? false;
  const outputPort = node.outputPorts[0];

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
    onPortClick(node.id, outputPort.id, true, portPosition);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(!isOn);
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
            isOn
              ? 'bg-gradient-to-br from-green-900/70 to-green-800/50 border-green-400 shadow-xl shadow-green-500/30'
              : 'bg-gradient-to-br from-gray-800/90 to-gray-900/90 border-gray-600 hover:border-gray-500'
          }`}
        >
          {/* Иконка */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
            isOn ? 'bg-green-500/30' : 'bg-gray-700/50'
          }`}>
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke={isOn ? '#4ade80' : '#9ca3af'} strokeWidth="2">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="flex flex-col gap-1">
            <span className="text-white font-semibold text-sm tracking-wide">INPUT</span>
            <span className={`text-xs font-medium ${
              isOn ? 'text-green-400' : 'text-gray-500'
            }`}>
              {isOn ? 'Active' : 'Inactive'}
            </span>
          </div>
          
          {/* Свитчер */}
          <button
            onClick={handleToggle}
            className={`w-14 h-7 rounded-full transition-all duration-300 relative shadow-inner ${
              isOn 
                ? 'bg-gradient-to-r from-green-500 to-green-400' 
                : 'bg-gray-700'
            }`}
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                isOn ? 'translate-x-8' : 'translate-x-1'
              }`}
            />
          </button>
          
          {/* Значение */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-lg transition-all ${
            isOn 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-gray-700/50 text-gray-500'
          }`}>
            {isOn ? '1' : '0'}
          </div>
        </div>

        {/* Output порт */}
        <div
          data-port-id={outputPort.id}
          className={`absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-3 cursor-pointer transition-all duration-200 hover:scale-125 z-10 ${
            isOn
              ? 'bg-green-400 border-green-300 shadow-lg shadow-green-400/50'
              : 'bg-gray-600 border-gray-400 hover:bg-gray-500'
          }`}
          style={{ right: -10 }}
          onMouseDown={(e) => e.stopPropagation()}
          onClick={handlePortClick}
        >
          <div className={`absolute inset-1 rounded-full ${
            isOn ? 'bg-green-300' : 'bg-gray-500'
          }`} />
        </div>
      </div>
    </div>
  );
}
