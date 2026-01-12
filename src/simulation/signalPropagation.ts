// Логика симуляции цепи - распространение сигналов

import type { Node, Connection } from '../types';

// Вычисление выходного значения для логического вентиля
function computeGateOutput(node: Node): boolean {
  switch (node.type) {
    case 'and':
      // AND: все входы должны быть true
      return node.inputPorts.length > 0 && node.inputPorts.every(port => port.value);
    
    case 'or':
      // OR: хотя бы один вход должен быть true
      return node.inputPorts.length > 0 && node.inputPorts.some(port => port.value);
    
    case 'not':
      // NOT: инвертирует первый вход
      return node.inputPorts.length > 0 && !node.inputPorts[0].value;
    
    case 'nand':
      // NAND: NOT AND
      return !(node.inputPorts.length > 0 && node.inputPorts.every(port => port.value));
    
    case 'nor':
      // NOR: NOT OR
      return !(node.inputPorts.length > 0 && node.inputPorts.some(port => port.value));
    
    case 'xor':
      // XOR: нечетное количество true входов
      return node.inputPorts.filter(port => port.value).length % 2 === 1;
    
    case 'xnor':
      // XNOR: четное количество true входов (включая 0)
      return node.inputPorts.filter(port => port.value).length % 2 === 0;
    
    default:
      return false;
  }
}

// Применение соединений - передача значений от выходных портов к входным
function applyConnections(nodes: Node[], connections: Connection[]): void {
  connections.forEach((conn) => {
    const fromNode = nodes.find((n) => n.id === conn.fromNodeId);
    const toNode = nodes.find((n) => n.id === conn.toNodeId);

    if (fromNode && toNode) {
      const fromPort = fromNode.outputPorts.find((p) => p.id === conn.fromPortId);
      const toPort = toNode.inputPorts.find((p) => p.id === conn.toPortId);

      if (fromPort && toPort) {
        toPort.value = fromPort.value;
      }
    }
  });
}

// Сброс всех входных портов
function resetInputPorts(nodes: Node[]): void {
  nodes.forEach((node) => {
    node.inputPorts.forEach((port) => {
      port.value = false;
    });
  });
}

// Обновление выходных портов логических вентилей
function updateGateOutputs(nodes: Node[]): void {
  nodes.forEach((node) => {
    // Пропускаем input/output ноды - у них логика другая
    if (node.type === 'input' || node.type === 'output') return;

    const outputValue = computeGateOutput(node);
    node.outputPorts.forEach(port => {
      port.value = outputValue;
    });
  });
}

/**
 * Распространение сигналов через схему
 * Выполняет несколько итераций для корректного прохождения сигналов через каскады вентилей
 */
export function propagateSignals(nodes: Node[], connections: Connection[]): Node[] {
  // Создаем глубокую копию нод для изменения
  const updatedNodes = nodes.map(node => ({
    ...node,
    inputPorts: node.inputPorts.map(port => ({ ...port })),
    outputPorts: node.outputPorts.map(port => ({ ...port })),
  }));

  // Сбрасываем все входные порты
  resetInputPorts(updatedNodes);

  // Выполняем несколько итераций для прохождения сигналов через каскады
  // Количество итераций = количество нод (в худшем случае - линейная цепочка)
  const maxIterations = updatedNodes.length;
  
  for (let i = 0; i < maxIterations; i++) {
    // Применяем соединения
    applyConnections(updatedNodes, connections);
    
    // Вычисляем выходы для всех вентилей
    updateGateOutputs(updatedNodes);
  }

  // Финальное применение соединений
  applyConnections(updatedNodes, connections);

  return updatedNodes;
}

/**
 * Синхронное распространение сигналов (мутирует переданный массив)
 * Используется для оптимизации при работе внутри setState
 */
export function propagateSignalsSync(nodes: Node[], connections: Connection[]): void {
  // Сбрасываем все входные порты
  resetInputPorts(nodes);

  // Первый проход: применяем соединения от input нод
  applyConnections(nodes, connections);

  // Вычисляем выходы для всех вентилей
  updateGateOutputs(nodes);

  // Второй проход: применяем соединения от вентилей
  applyConnections(nodes, connections);
}
