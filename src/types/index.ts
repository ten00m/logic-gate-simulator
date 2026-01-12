// Типы данных для симулятора логических вентилей

export type NodeType = 'input' | 'output' | 'and' | 'or' | 'not' | 'nand' | 'nor' | 'xor' | 'xnor';

export interface Port {
  id: string;
  nodeId: string;
  type: 'input' | 'output';
  position: { x: number; y: number }; // Относительная позиция порта внутри ноды
  value: boolean;
}

export interface Node {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  inputPorts: Port[];
  outputPorts: Port[];
  value?: boolean; // Для input-нод - текущее значение свитчера
  isSelected?: boolean; // Выделен ли узел
}

export interface Connection {
  id: string;
  fromPortId: string;
  fromNodeId: string;
  toPortId: string;
  toNodeId: string;
}

export interface DragState {
  isDragging: boolean;
  nodeType: NodeType | null;
}

export interface PendingConnection {
  fromPortId: string;
  fromNodeId: string;
  fromPosition: { x: number; y: number };
  isFromOutput: boolean;
}

export interface CanvasState {
  nodes: Node[];
  connections: Connection[];
  offset: { x: number; y: number };
  scale: number;
  pendingConnection: PendingConnection | null;
  mousePosition: { x: number; y: number };
}
