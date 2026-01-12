import { useRef, useState, useCallback, useEffect } from 'react';
import type { Node, NodeType, Connection, PendingConnection } from '../types';
import InputNode from './nodes/InputNode';
import OutputNode from './nodes/OutputNode';
import AndNode from './nodes/AndNode';
import OrNode from './nodes/OrNode';
import NotNode from './nodes/NotNode';
import ConnectionLine from './ConnectionLine';

interface CanvasProps {
  nodes: Node[];
  connections: Connection[];
  onAddNode: (type: NodeType, position: { x: number; y: number }) => void;
  onUpdateNode: (id: string, updates: Partial<Node>) => void;
  onAddConnection: (fromNodeId: string, fromPortId: string, toNodeId: string, toPortId: string) => void;
  onDeleteConnection: (id: string) => void;
  onDeleteNode: (id: string) => void;
}

export default function Canvas({
  nodes,
  connections,
  onAddNode,
  onUpdateNode,
  onAddConnection,
  onDeleteConnection,
  onDeleteNode,
}: CanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [scale, setScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [pendingConnection, setPendingConnection] = useState<PendingConnection | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [canvasMode, setCanvasMode] = useState<'pan' | 'select'>('pan');
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  const [selectionBox, setSelectionBox] = useState<{ start: { x: number; y: number }; current: { x: number; y: number } } | null>(null);

  // Обработка drop из меню
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData('nodeType') as NodeType;
      if (!nodeType || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - offset.x) / scale;
      const y = (e.clientY - rect.top - offset.y) / scale;

      onAddNode(nodeType, { x, y });
    },
    [offset, scale, onAddNode]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Обработка zoom колесиком мыши
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(scale * delta, 0.25), 4);

      // Zoom к позиции курсора
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const newOffsetX = mouseX - (mouseX - offset.x) * (newScale / scale);
        const newOffsetY = mouseY - (mouseY - offset.y) * (newScale / scale);

        setOffset({ x: newOffsetX, y: newOffsetY });
      }

      setScale(newScale);
    },
    [scale, offset]
  );

  // Pan (перемещение области видимости)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Pan при клике левой кнопкой мыши на канвас (не на ноды)
      // Средняя кнопка мыши всегда включает pan
      if (e.button === 1) {
        e.preventDefault();
        setIsPanning(true);
        setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      } else if (e.button === 0) {
        // Левая кнопка - поведение зависит от режима
        const target = e.target as HTMLElement;
        const isCanvasClick = target === containerRef.current || 
                              target.tagName === 'svg' || 
                              target.closest('.canvas-background');
        
        if (canvasMode === 'pan') {
          // В режиме pan - обычное панорамирование
          if (isCanvasClick) {
            setIsPanning(true);
            setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
          }
        } else if (canvasMode === 'select') {
          // В режиме select - выделение элементов
          if (isCanvasClick) {
            // Клик на пустое место - начало drag selection
            if (!e.ctrlKey && !e.shiftKey) {
              setSelectedNodeIds(new Set());
            }
            
            // Начало выделения прямоугольником
            const rect = containerRef.current!.getBoundingClientRect();
            setSelectionBox({
              start: {
                x: (e.clientX - rect.left - offset.x) / scale,
                y: (e.clientY - rect.top - offset.y) / scale,
              },
              current: {
                x: (e.clientX - rect.left - offset.x) / scale,
                y: (e.clientY - rect.top - offset.y) / scale,
              },
            });
          }
        }
      }
    },
    [offset, scale, canvasMode]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // Обновляем позицию мыши для отрисовки pending connection
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const mousePos = {
          x: (e.clientX - rect.left - offset.x) / scale,
          y: (e.clientY - rect.top - offset.y) / scale,
        };
        setMousePosition(mousePos);

        // Обновляем selection box при drag
        if (selectionBox) {
          setSelectionBox({
            ...selectionBox,
            current: mousePos,
          });
        }
      }

      if (isPanning) {
        setOffset({
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }

      // Перетаскивание ноды (только в режиме pan)
      if (draggingNodeId && containerRef.current && canvasMode === 'pan') {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - offset.x) / scale - dragOffset.x;
        const y = (e.clientY - rect.top - offset.y) / scale - dragOffset.y;

        onUpdateNode(draggingNodeId, { position: { x, y } });
      }
    },
    [isPanning, panStart, draggingNodeId, dragOffset, offset, scale, onUpdateNode, selectionBox, canvasMode]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
    setDraggingNodeId(null);

    // Завершение drag selection
    if (selectionBox) {
      const minX = Math.min(selectionBox.start.x, selectionBox.current.x);
      const maxX = Math.max(selectionBox.start.x, selectionBox.current.x);
      const minY = Math.min(selectionBox.start.y, selectionBox.current.y);
      const maxY = Math.max(selectionBox.start.y, selectionBox.current.y);

      const newSelected = new Set<string>();
      nodes.forEach((node) => {
        const nodeLeft = node.position.x;
        const nodeRight = node.position.x + 150; // примерная ширина узла
        const nodeTop = node.position.y;
        const nodeBottom = node.position.y + 120; // примерная высота узла

        if (nodeRight > minX && nodeLeft < maxX && nodeBottom > minY && nodeTop < maxY) {
          newSelected.add(node.id);
        }
      });

      setSelectedNodeIds(newSelected);
      setSelectionBox(null);
    }
  }, [selectionBox, nodes]);

  // Отмена pending connection при клике на пустое место
  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    // Проверяем, что клик был именно на канвас, а не на элементы внутри
    const target = e.target as HTMLElement;
    
    // Если кликнули на порт или ноду - не отменяем
    if (target.closest('[data-port-id]') || target.closest('.node-body')) {
      return;
    }
    
    // Отменяем pending connection
    if (pendingConnection) {
      setPendingConnection(null);
    }
  }, [pendingConnection]);

  // Начало перетаскивания ноды
  const handleNodeDragStart = useCallback(
    (nodeId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      const node = nodes.find((n) => n.id === nodeId);
      if (!node || !containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = (e.clientX - rect.left - offset.x) / scale;
      const mouseY = (e.clientY - rect.top - offset.y) / scale;

      // В режиме select - выделяем узел
      if (canvasMode === 'select') {
        if (e.shiftKey || e.ctrlKey) {
          // Ctrl/Shift + клик добавляет к выделению
          setSelectedNodeIds((prev) => new Set([...prev, nodeId]));
        } else {
          // Обычный клик выделяет только этот узел
          setSelectedNodeIds(new Set([nodeId]));
        }
        return;
      }

      setDraggingNodeId(nodeId);
      setDragOffset({
        x: mouseX - node.position.x,
        y: mouseY - node.position.y,
      });
    },
    [nodes, offset, scale, canvasMode]
  );

  // Обработка начала соединения (клик на порт)
  const handlePortClick = useCallback(
    (nodeId: string, portId: string, isOutput: boolean, portPosition: { x: number; y: number }) => {
      if (!pendingConnection) {
        // Начинаем новое соединение
        setPendingConnection({
          fromPortId: portId,
          fromNodeId: nodeId,
          fromPosition: portPosition,
          isFromOutput: isOutput,
        });
      } else {
        // Завершаем соединение
        // Можно соединять только output -> input
        if (pendingConnection.isFromOutput !== isOutput) {
          if (pendingConnection.isFromOutput) {
            onAddConnection(pendingConnection.fromNodeId, pendingConnection.fromPortId, nodeId, portId);
          } else {
            onAddConnection(nodeId, portId, pendingConnection.fromNodeId, pendingConnection.fromPortId);
          }
        }
        setPendingConnection(null);
      }
    },
    [pendingConnection, onAddConnection]
  );

  // Получение абсолютной позиции порта из DOM
  const getPortPosition = useCallback(
    (_nodeId: string, portId: string): { x: number; y: number } | null => {
      const portElement = containerRef.current?.querySelector(`[data-port-id="${portId}"]`);
      if (!portElement || !containerRef.current) return null;

      const portRect = portElement.getBoundingClientRect();
      const canvasRect = containerRef.current.getBoundingClientRect();

      return {
        x: (portRect.left + portRect.width / 2 - canvasRect.left - offset.x) / scale,
        y: (portRect.top + portRect.height / 2 - canvasRect.top - offset.y) / scale,
      };
    },
    [offset, scale]
  );

  // Предотвращаем скролл страницы при wheel на канвасе
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const preventDefault = (e: WheelEvent) => e.preventDefault();
    container.addEventListener('wheel', preventDefault, { passive: false });

    return () => {
      container.removeEventListener('wheel', preventDefault);
    };
  }, []);

  // Обработка клавиши Delete для удаления выделенных элементов
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedNodeIds.size > 0) {
        selectedNodeIds.forEach((nodeId) => {
          onDeleteNode(nodeId);
        });
        setSelectedNodeIds(new Set());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeIds, onDeleteNode]);

  return (
    <div
      ref={containerRef}
      className="canvas-container flex-1 bg-gray-950 overflow-hidden relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onClick={handleCanvasClick}
      style={{ cursor: isPanning ? 'grabbing' : draggingNodeId ? 'move' : canvasMode === 'pan' ? 'grab' : 'pointer' }}
    >
      {/* Контекстное меню режимов */}
      <div className="absolute top-4 left-4 z-50 flex gap-2 bg-gray-800 rounded-lg p-2 border border-gray-700">
        <button
          onClick={() => setCanvasMode('pan')}
          className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
            canvasMode === 'pan'
              ? 'bg-blue-500/40 border border-blue-400 text-blue-300'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-gray-200'
          }`}
          title="Режим панорамирования"
        >
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            width="auto" height="auto" viewBox="0 100 1280 1280"
            preserveAspectRatio="xMidYMid meet">
            <metadata>
            Created by potrace 1.15, written by Peter Selinger 2001-2017
            </metadata>
            <g transform="translate(320,1050.000000) scale(0.050000,-0.050000)"
            fill="#fff" stroke="none">
            <path d="M3535 12596 c-173 -34 -312 -112 -461 -261 -214 -212 -329 -453 -394
            -824 -26 -149 -42 -407 -35 -551 11 -204 62 -790 220 -2535 110 -1216 119
            -1319 114 -1334 -2 -6 -62 60 -134 147 -150 180 -452 493 -604 625 -294 253
            -560 416 -778 474 -87 24 -116 27 -263 26 -181 0 -246 -12 -393 -73 -216 -90
            -423 -290 -522 -504 -62 -132 -79 -214 -80 -366 0 -218 25 -279 248 -611 512
            -761 1002 -1710 1613 -3121 180 -417 258 -566 415 -798 170 -252 360 -463 629
            -699 l155 -137 13 -59 c20 -95 10 -544 -18 -781 -21 -185 -22 -193 -4 -229 11
            -23 41 -55 78 -82 249 -184 749 -313 1461 -377 439 -40 1000 -47 1077 -13 129
            55 193 158 353 562 137 347 238 523 311 541 35 9 98 -36 138 -99 79 -125 120
            -279 175 -664 41 -285 57 -341 109 -396 103 -109 368 -150 982 -151 l385 -1
            33 23 c18 13 39 36 46 51 8 15 29 105 46 201 93 518 229 1059 342 1360 120
            322 209 448 768 1090 451 518 572 683 640 869 124 338 336 1515 434 2401 43
            389 51 507 50 790 0 266 -1 278 -26 372 -99 365 -360 645 -693 743 -128 38
            -291 38 -418 1 -193 -57 -351 -169 -498 -354 -66 -82 -59 -86 -79 48 -36 237
            -102 472 -166 589 -267 490 -833 647 -1316 366 -169 -99 -355 -271 -435 -401
            -9 -16 -12 -16 -16 -4 -3 8 -19 62 -37 120 -95 313 -240 486 -513 615 -154 73
            -360 113 -516 101 -387 -30 -673 -232 -827 -584 -19 -42 -34 -69 -34 -59 0 30
            -78 839 -106 1102 -117 1111 -241 1843 -358 2131 -87 213 -315 472 -524 597
            -192 114 -405 158 -587 123z"/>
            </g>
            </svg>
        </button>
        <button
          onClick={() => setCanvasMode('select')}
          className={`flex items-center justify-center w-10 h-10 rounded-lg transition-colors ${
            canvasMode === 'select'
              ? 'bg-blue-500/40 border border-blue-400 text-blue-300'
              : 'bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-gray-200'
          }`}
          title="Режим выделения"
        >
          <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
            width="1280.000000pt" height="1280.000000pt" viewBox="0 0 1280.000000 1280.000000"
            preserveAspectRatio="xMidYMid meet">
            <metadata>
            Created by potrace 1.15, written by Peter Selinger 2001-2017
            </metadata>
            <g transform="translate(320,1000.000000) scale(0.050000,-0.050000)"
            fill="#fff" stroke="none">
            <path d="M3728 9443 c1 -1753 6 -4085 10 -5181 l7 -1993 1020 1142 c561 628
            1029 1153 1041 1167 l21 25 136 -414 c74 -228 323 -985 552 -1684 459 -1401
            785 -2388 791 -2394 9 -10 1056 427 1092 454 2 2 -42 126 -97 277 -389 1067
            -1493 4159 -1488 4165 5 4 269 -22 2062 -203 462 -46 850 -83 862 -82 19 3
            -417 578 -2983 3938 -1652 2164 -3010 3943 -3017 3953 -9 14 -11 -665 -9
            -3170z"/>
            </g>
            </svg>
        </button>
      </div>

      {/* Сетка фона - кликабельная для pan и отмены соединений */}
      <div 
        className="canvas-background absolute inset-0 w-full h-full"
        style={{
          backgroundImage: `radial-gradient(circle, #374151 1px, transparent 1px)`,
          backgroundSize: `${20 * scale}px ${20 * scale}px`,
          backgroundPosition: `${offset.x}px ${offset.y}px`,
        }}
        onClick={() => {
          if (pendingConnection) {
            setPendingConnection(null);
          }
        }}
      />

      {/* Трансформируемый контейнер для нод и соединений */}
      <div
        className="absolute"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          transformOrigin: '0 0',
        }}
      >
        {/* Selection box при drag select */}
        {selectionBox && (
          <div
            style={{
              position: 'absolute',
              left: Math.min(selectionBox.start.x, selectionBox.current.x),
              top: Math.min(selectionBox.start.y, selectionBox.current.y),
              width: Math.abs(selectionBox.current.x - selectionBox.start.x),
              height: Math.abs(selectionBox.current.y - selectionBox.start.y),
              border: '2px dashed #3b82f6',
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              pointerEvents: 'none',
            }}
          />
        )}

        {/* SVG для соединений */}
        <svg className="absolute overflow-visible" style={{ width: 1, height: 1 }}>
          {/* Существующие соединения */}
          {connections.map((conn) => {
            const fromPos = getPortPosition(conn.fromNodeId, conn.fromPortId);
            const toPos = getPortPosition(conn.toNodeId, conn.toPortId);
            if (!fromPos || !toPos) return null;

            // Получаем значение из output порта для цвета линии
            const fromNode = nodes.find((n) => n.id === conn.fromNodeId);
            const fromPort = fromNode?.outputPorts.find((p) => p.id === conn.fromPortId);
            const isActive = fromPort?.value ?? false;

            return (
              <ConnectionLine
                key={conn.id}
                from={fromPos}
                to={toPos}
                isActive={isActive}
                onClick={() => onDeleteConnection(conn.id)}
              />
            );
          })}

          {/* Pending connection (соединение в процессе создания) */}
          {pendingConnection && (
            <ConnectionLine
              from={pendingConnection.fromPosition}
              to={mousePosition}
              isPending
            />
          )}
        </svg>

        {/* Ноды */}
        {nodes.map((node) => {
          const isSelected = selectedNodeIds.has(node.id);
          
          if (node.type === 'input') {
            return (
              <InputNode
                key={node.id}
                node={node}
                onDragStart={handleNodeDragStart}
                onPortClick={handlePortClick}
                onToggle={(value) => onUpdateNode(node.id, { value })}
                canvasOffset={offset}
                canvasScale={scale}
                isSelected={isSelected}
              />
            );
          }
          if (node.type === 'output') {
            return (
              <OutputNode
                key={node.id}
                node={node}
                onDragStart={handleNodeDragStart}
                onPortClick={handlePortClick}
                canvasOffset={offset}
                canvasScale={scale}
                isSelected={isSelected}
              />
            );
          }
          if (node.type === 'and') {
            return (
              <AndNode
                key={node.id}
                node={node}
                onDragStart={handleNodeDragStart}
                onPortClick={handlePortClick}
                canvasOffset={offset}
                canvasScale={scale}
                isSelected={isSelected}
              />
            );
          }
          if (node.type === 'or') {
            return (
              <OrNode
                key={node.id}
                node={node}
                onDragStart={handleNodeDragStart}
                onPortClick={handlePortClick}
                canvasOffset={offset}
                canvasScale={scale}
                isSelected={isSelected}
              />
            );
          }
          if (node.type === 'not') {
            return (
              <NotNode
                key={node.id}
                node={node}
                onDragStart={handleNodeDragStart}
                onPortClick={handlePortClick}
                canvasOffset={offset}
                canvasScale={scale}
                isSelected={isSelected}
              />
            );
          }
          return null;
        })}
      </div>

      {/* Информация о масштабе */}
      <div className="absolute bottom-4 right-4 bg-gray-800 px-3 py-1 rounded text-gray-400 text-sm">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
}
