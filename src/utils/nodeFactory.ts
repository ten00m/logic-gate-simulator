// Фабрика создания нод по типу

import type { Node, NodeType } from '../types';
import { generateNodeId, generatePortId } from './idGenerator';

export function createNode(type: NodeType, position: { x: number; y: number }): Node {
  const id = generateNodeId();

  switch (type) {
    case 'input':
      return {
        id,
        type,
        position,
        value: false,
        inputPorts: [],
        outputPorts: [
          {
            id: generatePortId(id, 'out', 0),
            nodeId: id,
            type: 'output',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
      };

    case 'output':
      return {
        id,
        type,
        position,
        inputPorts: [
          {
            id: generatePortId(id, 'in', 0),
            nodeId: id,
            type: 'input',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
        outputPorts: [],
      };

    case 'and':
      return {
        id,
        type,
        position,
        inputPorts: [
          {
            id: generatePortId(id, 'in', 0),
            nodeId: id,
            type: 'input',
            position: { x: 0, y: 0 },
            value: false,
          },
          {
            id: generatePortId(id, 'in', 1),
            nodeId: id,
            type: 'input',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
        outputPorts: [
          {
            id: generatePortId(id, 'out', 0),
            nodeId: id,
            type: 'output',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
      };

    case 'or':
      return {
        id,
        type,
        position,
        inputPorts: [
          {
            id: generatePortId(id, 'in', 0),
            nodeId: id,
            type: 'input',
            position: { x: 0, y: 0 },
            value: false,
          },
          {
            id: generatePortId(id, 'in', 1),
            nodeId: id,
            type: 'input',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
        outputPorts: [
          {
            id: generatePortId(id, 'out', 0),
            nodeId: id,
            type: 'output',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
      };

    case 'not':
      return {
        id,
        type,
        position,
        inputPorts: [
          {
            id: generatePortId(id, 'in', 0),
            nodeId: id,
            type: 'input',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
        outputPorts: [
          {
            id: generatePortId(id, 'out', 0),
            nodeId: id,
            type: 'output',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
      };

    case 'xor':
      return {
        id,
        type,
        position,
        inputPorts: [
          {
            id: generatePortId(id, 'in', 0),
            nodeId: id,
            type: 'input',
            position: { x: 0, y: 0 },
            value: false,
          },
          {
            id: generatePortId(id, 'in', 1),
            nodeId: id,
            type: 'input',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
        outputPorts: [
          {
            id: generatePortId(id, 'out', 0),
            nodeId: id,
            type: 'output',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
      };

    case 'nand':
      return {
        id,
        type,
        position,
        inputPorts: [
          {
            id: generatePortId(id, 'in', 0),
            nodeId: id,
            type: 'input',
            position: { x: 0, y: 0 },
            value: false,
          },
          {
            id: generatePortId(id, 'in', 1),
            nodeId: id,
            type: 'input',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
        outputPorts: [
          {
            id: generatePortId(id, 'out', 0),
            nodeId: id,
            type: 'output',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
      };

    case 'nor':
      return {
        id,
        type,
        position,
        inputPorts: [
          {
            id: generatePortId(id, 'in', 0),
            nodeId: id,
            type: 'input',
            position: { x: 0, y: 0 },
            value: false,
          },
          {
            id: generatePortId(id, 'in', 1),
            nodeId: id,
            type: 'input',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
        outputPorts: [
          {
            id: generatePortId(id, 'out', 0),
            nodeId: id,
            type: 'output',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
      };

    case 'xnor':
      return {
        id,
        type,
        position,
        inputPorts: [
          {
            id: generatePortId(id, 'in', 0),
            nodeId: id,
            type: 'input',
            position: { x: 0, y: 0 },
            value: false,
          },
          {
            id: generatePortId(id, 'in', 1),
            nodeId: id,
            type: 'input',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
        outputPorts: [
          {
            id: generatePortId(id, 'out', 0),
            nodeId: id,
            type: 'output',
            position: { x: 0, y: 0 },
            value: false,
          },
        ],
      };

    default:
      return {
        id,
        type,
        position,
        inputPorts: [],
        outputPorts: [],
      };
  }
}
