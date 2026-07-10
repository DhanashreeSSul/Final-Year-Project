import React from 'react';
export default function Spinner({ size = 36 }) {
  return <div className="spinner-pink" style={{width:size,height:size,borderWidth:size/12}} />;
}
