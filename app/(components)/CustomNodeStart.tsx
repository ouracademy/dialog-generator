import  { memo } from 'react';
import { Handle, Position } from 'reactflow';

export default memo(({ data, isConnectable }: any) => {
  return (
    <div className=''>
      <div>
        {data.label}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
     
        style={{  background: '#555' }}
        isConnectable={isConnectable}
      />
    </div>
  );
});
