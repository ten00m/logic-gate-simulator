// Кастомный хук для управления схемой (ноды + соединения + симуляция)

import { useState, useCallback } from 'react';
import type { Node, NodeType, Connection } from '../types';
import { createNode } from '../utils/nodeFactory';
import { generateConnectionId } from '../utils/idGenerator';
import { propagateSignalsSync } from '../simulation/signalPropagation';

export function useCircuit() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  // Добавление новой ноды
  const addNode = useCallback((type: NodeType, position: { x: number; y: number }) => {
    const newNode = createNode(type, position);
    setNodes((prev) => [...prev, newNode]);
  }, []);

  // Обновление ноды
  const updateNode = useCallback((id: string, updates: Partial<Node>) => {
    setNodes((prev) => {
      const updated = prev.map((node) => {
        if (node.id !== id) return node;

        const updatedNode = { ...node, ...updates };

        // Если обновляется value у input-ноды, обновляем значение output порта
        if (updates.value !== undefined && node.type === 'input') {
          updatedNode.outputPorts = node.outputPorts.map((port) => ({
            ...port,
            value: updates.value!,
          }));
        }

        return updatedNode;
      });

      // Пересчитываем значения связанных нод
      propagateSignalsSync(updated, connections);
      
      return updated;
    });
  }, [connections]);

  // Удаление ноды
  const deleteNode = useCallback((id: string) => {
    setNodes((prev) => prev.filter((node) => node.id !== id));
    // Удаляем все связанные соединения
    setConnections((prev) => 
      prev.filter((conn) => conn.fromNodeId !== id && conn.toNodeId !== id)
    );
  }, []);

  // Добавление соединения
  const addConnection = useCallback(
    (fromNodeId: string, fromPortId: string, toNodeId: string, toPortId: string) => {
      setConnections((prev) => {
        // Проверяем, не существует ли уже такое соединение
        const exists = prev.some(
          (c) =>
            (c.fromPortId === fromPortId && c.toPortId === toPortId) ||
            (c.fromPortId === toPortId && c.toPortId === fromPortId)
        );
        if (exists) return prev;

        // Проверяем, что входной порт еще не занят
        const inputOccupied = prev.some((c) => c.toPortId === toPortId);
        if (inputOccupied) return prev;

        const newConnection: Connection = {
          id: generateConnectionId(),
          fromNodeId,
          fromPortId,
          toNodeId,
          toPortId,
        };

        return [...prev, newConnection];
      });

      // Пересчитываем сигналы после добавления соединения
      setTimeout(() => {
        setNodes((prevNodes) => {
          const updatedNodes = [...prevNodes];
          setConnections((currentConnections) => {
            propagateSignalsSync(updatedNodes, currentConnections);
            return currentConnections;
          });
          return updatedNodes;
        });
      }, 0);
    },
    []
  );

  // Удаление соединения
  const deleteConnection = useCallback((id: string) => {
    setConnections((prev) => prev.filter((c) => c.id !== id));
    
    // Пересчитываем сигналы после удаления соединения
    setTimeout(() => {
      setNodes((prevNodes) => {
        const updatedNodes = [...prevNodes];
        setConnections((currentConnections) => {
          propagateSignalsSync(updatedNodes, currentConnections);
          return currentConnections;
        });
        return updatedNodes;
      });
    }, 0);
  }, []);

  return {
    nodes,
    connections,
    addNode,
    updateNode,
    deleteNode,
    addConnection,
    deleteConnection,
  };
}
