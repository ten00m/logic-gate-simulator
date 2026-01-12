import { useCallback } from 'react';
import type { NodeType } from './types';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import { useCircuit } from './hooks/useCircuit';

function App() {
  const {
    nodes,
    connections,
    addNode,
    updateNode,
    addConnection,
    deleteConnection,
    deleteNode,
  } = useCircuit();

  // Handler для начала перетаскивания из меню (можно использовать для визуального фидбека)
  const handleDragStart = useCallback((_nodeType: NodeType) => {
    // Можно добавить визуальный эффект при начале перетаскивания
  }, []);

  return (
    <div className="h-screen w-screen flex bg-gray-950 overflow-hidden">
      <Sidebar onDragStart={handleDragStart} />
      <Canvas
        nodes={nodes}
        connections={connections}
        onAddNode={addNode}
        onUpdateNode={updateNode}
        onAddConnection={addConnection}
        onDeleteConnection={deleteConnection}
        onDeleteNode={deleteNode}
      />
    </div>
  );
}

export default App;
