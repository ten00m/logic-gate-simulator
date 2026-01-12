// Генераторы уникальных ID

let nodeIdCounter = 0;
let connectionIdCounter = 0;

export const generateNodeId = () => `node-${++nodeIdCounter}`;

export const generatePortId = (nodeId: string, type: 'in' | 'out', index: number) =>
  `${nodeId}-${type}-${index}`;

export const generateConnectionId = () => `conn-${++connectionIdCounter}`;

// Функции для сброса счетчиков (для тестов)
export const resetCounters = () => {
  nodeIdCounter = 0;
  connectionIdCounter = 0;
};
