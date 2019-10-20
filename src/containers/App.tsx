import React from 'react';
import styled from 'styled-components';
import EditorContainer from './EditorContainer';
import 'antd/dist/antd.css';

const AppContainer = styled.div`
  min-height: 100vh;
  height: 100%;
  width: 100%;
`

const App: React.FC = () => {
  return (
    <AppContainer>
      <EditorContainer/>
    </AppContainer>
  );
}

export default App;