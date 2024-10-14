import React from 'react';

function NodeVersion() {
  const nodeVersion = process.env.REACT_APP_NODE_VERSION || 'Unknown';

  return (
    <div>
      <h1>Node.js Version: {nodeVersion}</h1>
    </div>
  );
}

export default NodeVersion;
