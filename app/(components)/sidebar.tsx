"use client";

export default () => {
  const onDragStart = (event: any, nodeType: any) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">Puede arrastrar estos nodos al panel de la izquierda</div>
      {/* <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Nodo inicio
      </div> */}
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        NODO
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        FIN
      </div>
      {/* <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'selectorNode')} draggable>
        Custom Node
      </div> */}

      
    </aside>
  );
};
