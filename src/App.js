import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import SimpleQuizV1 from './components/class_base/simple-quiz-v1.js';
import SimpleQuizV2 from './components/function_base/simple-quiz-v2.js';
import { Container, Button, Row, Col } from 'react-bootstrap';
import React, { useState } from 'react';

function App() {
  const [code, setCode] = useState(null);
  return (
    <Container className="App">
      {
        code !== null ? (
          code == 'cls' ? ( <SimpleQuizV1/> ) : ( <SimpleQuizV2/> )
        ) : (
          <Row style={{paddingTop:'5em'}}>
            <Col>
              <Button onClick={()=>setCode('cls')} variant="primary">Start quiz using CLASS based component</Button>
              <Button onClick={()=>setCode('fn')} variant="secondary">Start quiz using FUNCTION based component</Button>
            </Col>
          </Row>
        )
      }
    </Container>
  );
}

export default App;