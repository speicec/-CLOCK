
import React, { useEffect } from 'react';
import Taro from '@tarojs/taro';
import './app.scss';

function App({ children }: { children: React.ReactNode }) {
  // Can add global initialization here
  useEffect(() => {
    console.log('Niu Ma Clock Started');
  }, []);

  return (
    <>
      {children}
    </>
  );
}

export default App;
