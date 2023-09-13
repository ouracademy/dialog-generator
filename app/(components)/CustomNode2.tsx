import  { memo } from 'react';
import { Handle, Position } from 'reactflow';

export default memo(({ data, isConnectable }: any) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <div>
        {data.label}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
     
        style={{  background: '#555' }}
        isConnectable={isConnectable}
      />
      <Handle
        type="target"
        position={Position.Top}
      
        isConnectable={isConnectable}
      />
         <Handle
        type="source"
        position={Position.Bottom}
      
        isConnectable={isConnectable}
      />
    </>
  );
});
