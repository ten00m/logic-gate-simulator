import type { NodeType } from '../types';

interface SidebarProps {
  onDragStart: (nodeType: NodeType) => void;
}

interface MenuItem {
  type: NodeType;
  label: string;
  icon: React.ReactNode;
}

const ioMenuItems: MenuItem[] = [
  {
    type: 'input',
    label: 'Input',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <rect x="5" y="10" width="30" height="20" rx="4" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
        <circle cx="32" cy="20" r="4" fill="currentColor"/>
      </svg>
    ),
  },
  {
    type: 'output',
    label: 'Output',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        <circle cx="8" cy="20" r="4" fill="currentColor"/>
        <circle cx="25" cy="20" r="12" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="2"/>
      </svg>
    ),
  },
];

const logicMenuItems: MenuItem[] = [
  {
    type: 'and',
    label: 'AND',
    icon: (
      <svg viewBox="0 0 45 40" className="w-8 h-8">
        {/* Корпус AND как в блок-схемах: плоская левая сторона + выпуклая правая */}
        <path
          d="M10 10 H22 A10 10 0 0 1 22 30 H10 Z"
          fill="currentColor"
          opacity="0.2"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Входы */}
        <line x1="4" y1="16" x2="10" y2="16" stroke="currentColor" strokeWidth="2" />
        <line x1="4" y1="24" x2="10" y2="24" stroke="currentColor" strokeWidth="2" />
        <circle cx="4" cy="16" r="2" fill="currentColor" />
        <circle cx="4" cy="24" r="2" fill="currentColor" />
        {/* Выход */}
        <line x1="33" y1="20" x2="45" y2="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="43" cy="20" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    type: 'or',
    label: 'OR',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        {/* Корпус OR: вогнутая левая сторона + выпуклая правая */}
        <path
          d="M10 10 Q15 20 10 30 L15 30 Q25 30 30 20 Q25 10 15 10 Z"
          fill="currentColor"
          opacity="0.2"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Входы */}
        <line x1="4" y1="16" x2="10" y2="16" stroke="currentColor" strokeWidth="2" />
        <line x1="4" y1="24" x2="10" y2="24" stroke="currentColor" strokeWidth="2" />
        <circle cx="4" cy="16" r="2" fill="currentColor" />
        <circle cx="4" cy="24" r="2" fill="currentColor" />
        {/* Выход */}
        <line x1="30" y1="20" x2="37" y2="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="37" cy="20" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    type: 'not',
    label: 'NOT',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        {/* Корпус NOT: треугольник с кружком справа */}
        <path
          d="M10 12 L10 28 L25 20 Z"
          fill="currentColor"
          opacity="0.2"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Кружок инверсии (bubble) */}
        <circle cx="28" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
        {/* Вход */}
        <line x1="4" y1="20" x2="10" y2="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="4" cy="20" r="2" fill="currentColor" />
        {/* Выход */}
        <line x1="31" y1="20" x2="38" y2="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="38" cy="20" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    type: 'xor',
    label: 'XOR',
    icon: (
      <svg viewBox="0 0 45 40" className="w-8 h-8">
        {/* Корпус XOR: вогнутая левая сторона + выпуклая правая (похож на OR но с двойной линией слева) */}
        <path
          d="M12 10 Q16 20 12 30 L15 30 Q25 30 30 20 Q25 10 15 10 Z"
          fill="currentColor"
          opacity="0.2"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Дополнительная линия слева для XOR */}
        <path
          d="M10 10 Q12 20 10 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Входы */}
        <line x1="4" y1="16" x2="10" y2="16" stroke="currentColor" strokeWidth="2" />
        <line x1="4" y1="24" x2="10" y2="24" stroke="currentColor" strokeWidth="2" />
        <circle cx="4" cy="16" r="2" fill="currentColor" />
        <circle cx="4" cy="24" r="2" fill="currentColor" />
        {/* Выход */}
        <line x1="30" y1="20" x2="37" y2="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="37" cy="20" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    type: 'nand',
    label: 'NAND',
    icon: (
      <svg viewBox="0 0 45 40" className="w-8 h-8">
        {/* Корпус NAND: как AND + пузырь инверсии */}
        <path
          d="M10 10 H22 A10 10 0 0 1 22 30 H10 Z"
          fill="currentColor"
          opacity="0.2"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Кружок инверсии */}
        <circle cx="33" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
        {/* Входы */}
        <line x1="4" y1="16" x2="10" y2="16" stroke="currentColor" strokeWidth="2" />
        <line x1="4" y1="24" x2="10" y2="24" stroke="currentColor" strokeWidth="2" />
        <circle cx="4" cy="16" r="2" fill="currentColor" />
        <circle cx="4" cy="24" r="2" fill="currentColor" />
        {/* Выход */}
        <line x1="36" y1="20" x2="45" y2="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="43" cy="20" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    type: 'nor',
    label: 'NOR',
    icon: (
      <svg viewBox="0 0 40 40" className="w-8 h-8">
        {/* Корпус NOR: как OR + пузырь инверсии */}
        <path
          d="M10 10 Q15 20 10 30 L15 30 Q25 30 30 20 Q25 10 15 10 Z"
          fill="currentColor"
          opacity="0.2"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Кружок инверсии */}
        <circle cx="32" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
        {/* Входы */}
        <line x1="4" y1="16" x2="10" y2="16" stroke="currentColor" strokeWidth="2" />
        <line x1="4" y1="24" x2="10" y2="24" stroke="currentColor" strokeWidth="2" />
        <circle cx="4" cy="16" r="2" fill="currentColor" />
        <circle cx="4" cy="24" r="2" fill="currentColor" />
        {/* Выход */}
        <line x1="35" y1="20" x2="37" y2="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="37" cy="20" r="2" fill="currentColor" />
      </svg>
    ),
  },
  {
    type: 'xnor',
    label: 'XNOR',
    icon: (
      <svg viewBox="0 0 45 40" className="w-8 h-8">
        {/* Корпус XNOR: как XOR + пузырь инверсии */}
        <path
          d="M12 10 Q16 20 12 30 L15 30 Q25 30 30 20 Q25 10 15 10 Z"
          fill="currentColor"
          opacity="0.2"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Дополнительная линия слева для XNOR */}
        <path
          d="M10 10 Q12 20 10 30"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        {/* Кружок инверсии */}
        <circle cx="33" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="2" />
        {/* Входы */}
        <line x1="4" y1="16" x2="10" y2="16" stroke="currentColor" strokeWidth="2" />
        <line x1="4" y1="24" x2="10" y2="24" stroke="currentColor" strokeWidth="2" />
        <circle cx="4" cy="16" r="2" fill="currentColor" />
        <circle cx="4" cy="24" r="2" fill="currentColor" />
        {/* Выход */}
        <line x1="36" y1="20" x2="37" y2="20" stroke="currentColor" strokeWidth="2" />
        <circle cx="37" cy="20" r="2" fill="currentColor" />
      </svg>
    ),
  },
];

export default function Sidebar({ onDragStart }: SidebarProps) {
  return (
    <aside className="w-56 bg-gray-900 border-r border-gray-700 p-4 flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-white mb-2">Components</h2>
      
      <div className="flex flex-col gap-2">
        <h3 className="text-sm text-gray-400 uppercase tracking-wider">I/O</h3>
        {ioMenuItems.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('nodeType', item.type);
              onDragStart(item.type);
            }}
            className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors text-gray-200 hover:text-white"
          >
            <span className="text-blue-400">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-sm text-gray-400 uppercase tracking-wider">Логические вентили</h3>
        {logicMenuItems.map((item) => (
          <div
            key={item.type}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData('nodeType', item.type);
              onDragStart(item.type);
            }}
            className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg cursor-grab hover:bg-gray-700 transition-colors text-gray-200 hover:text-white"
          >
            <span className="text-blue-400">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </div>
        ))}
      </div>
    </aside>
  );
}
