import  { memo } from 'react';
import { Handle, Position } from 'reactflow';

export default memo(({ data, isConnectable }: any) => {
  return (
    <div className=''>
      <div>
        {data.label}
      </div>
      
      <Handle
        type="target"
        position={Position.Top}
     
        style={{  background: '#555' }}
        isConnectable={isConnectable}
      />
    </div>
  );
});
