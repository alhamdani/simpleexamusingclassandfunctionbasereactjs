import React, { useState, useEffect } from 'react';
import { Button, Row, Col, Modal } from 'react-bootstrap';
export default function SimpleQuizV2(){
  const [selectedAnswer, setSelectedAnswer] = useState(-1);
  const [countdown_timer, setCountdownTimer ] = useState(10);
  const [question_num, setQuestionNum] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isCalculating, setIsCalculating] = useState(true);
  const [current_question, setCurrentQuestion] = useState({});
  const [score, setScore] = useState(0);
  const [finished_question_index, setFinishedQuestionIndex] = useState([]);
  const [examinee_ans, setExamineeAns] = useState([]);
  const question_list = [
      {
          'id' : '101',
          'question' : 'The following are examples of Palindrome, except.',
          'options' : [
              'level', 'same', 'deified', 'noon', 'murdrum'
          ]
      },{
          'id' : '102',
          'question' : 'That perfume always "evokes" pleasant memories.',
          'options' : [
              'angers', 'erases', 'calls up', 'confuses'
          ]
      },{
          'id' : '103',
          'question' : 'The attorney wanted to "expedite" the process because her client was becoming impatient.',
          'options' : [
              'accelerate', 'evaluate', 'reverse', 'justify'
          ]
      },{
          'id' : '104',
          'question' : 'The suspect gave a "plausible" explanation for his presence at the scene, so the police decided to look elsewhere for the perpetrator of the crime.',
          'options' : [
              'unbelievable', 'credible', 'insufficient', 'apologetic'
          ]
      },{
          'id' : '105',
          'question' : 'He based his conclusion on what he "inferred" from the evidence, not on what he actually observed.',
          'options' : [
              'predicted', 'imagined', 'surmised', 'implied'
          ]
      },{
          'id' : '106',
          'question' : 'There is no PANACEA that will solve our financial difficulty.',
          'options' : [
              'cure-all', 'answer', 'paradox', 'criteria'
          ]
      },{
          'id' : '107',
          'question' : 'A multifarious task would',
          'options' : [
              'have many different components.', 'be very complex.', 'have very few components.', 'be impossible to complete.'
          ]
      },{
          'id' : '108',
          'question' : 'Plaintive cries would be',
          'options' : [
              'musical, soothing.', 'loud, jarring.', 'plain, uninteresting.', 'sorrowful, mournful.'
          ] 
      },{
          'id' : '109',
          'question' : 'People with inveterate beliefs',
          'options' : [
              'can be easily manipulated.', 'hold their beliefs deeply and passionately.', 'have adopted their beliefs from another.', 'change their beliefs frequently.'
          ]
      }
  ];
  let timer = null;
  function generateRandomInt(){
      return Math.floor(Math.random() * question_list.length);
  }
  function  calculateResult(){
    let counter = 0;
    // database entry
    let question_answers = {
        '101' : 1,
        '102' : 2,
        '103' : 0,
        '104' : 1,
        '105' : 2,
        '106' : 0,
        '107' : 0,
        '108' : 3,
        '109' : 1,
    };
    // add the last question answer
    examinee_ans.push(selectedAnswer);

    finished_question_index.forEach((item,idx)=>{
        let question = question_list[item];
        // query question answer to database
        let answer = question_answers[ question.id ];
        if( examinee_ans[idx] == answer ){
            counter += 1;
        }
    });
    setScore(counter);
    setIsCalculating(false);
  }
  function updateQuestionInfo(){
    let idx = generateRandomInt();
    while(true){
      if(finished_question_index.indexOf(idx)>=0){
        idx = generateRandomInt();
      }else{
        break;
      }
    }
    setExamineeAns([...examinee_ans,selectedAnswer]);
    setCurrentQuestion(question_list[idx]);
    setCountdownTimer(10);
    setFinishedQuestionIndex([...finished_question_index, parseInt(idx)]);
    setSelectedAnswer(-1);
  }
  function doTheCountDown(){
    return setTimeout(()=>{
      if(countdown_timer>0){
        setCountdownTimer(countdown_timer-1);
      }else{
        
        if(finished_question_index.length<5){
          updateQuestionInfo();
        }else{
          setIsFinished(true);
          setTimeout(()=>{
            calculateResult();
          },2000)
        }
      }
    },1000);
  }
  function nextQuestionBtn(){
    clearTimeout(timer);
    updateQuestionInfo();
  }
  function onChangeAnswer(ev){
    let {value}=ev.target;
    setSelectedAnswer(value);
  }
  
  useEffect(()=>{
    if(!Object.keys(current_question).length){
        let idx = generateRandomInt();
        setCurrentQuestion(question_list[idx]);
        // console.log(finished_question_index);
        finished_question_index.push(idx);
    }
    timer = doTheCountDown();
    return () => clearTimeout( timer );
  },[countdown_timer]);

  function constructOptions(){
    let _arr = [];
    if(Object.keys(current_question).length){
      current_question.options.forEach((item,idx)=>{
        _arr.push(
          <Col className='radio-ipt-choices' key={idx}>
              <input type='radio' checked={ selectedAnswer == idx } name='answer' value={idx} onChange={onChangeAnswer}/>
              <label>{item}</label>
          </Col>
        )
      })
    }
    return _arr;
  }
  return(
    <div>
      <Modal show={isFinished} onHide={()=>{}}>
        <Modal.Header >
            <Modal.Title>Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {
                isCalculating ? (
                    <p>Calculating result. Please wait . . . </p>
                ) : ( <p>Your score is : { score } / 5 </p>)
            }
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
      <h2>{countdown_timer}</h2>
      <p>{current_question.question}({finished_question_index.length} out of 5)</p>
      <hr/>
      <Row>
          { constructOptions() }
      </Row>
      <hr/>
      <Row className='text-right'>
        <Col>
          <Button disabled={finished_question_index.length===5} size="sm" type="button" variant="primary" onClick={nextQuestionBtn}>Next</Button>
        </Col>
      </Row>
    </div>
  )
}