import React from 'react';
import {Button, InputGroup, Row, Col, Modal} from 'react-bootstrap';
export default class SimpleQuizV1 extends React.Component{
    constructor(props){
        super(props);
        this.max_timer = 10;
        this.state = {
            selectedAnswer : -1,
            countdown_timer : 0,
            question_num : 0,
            isFinished : false,
            isCalculating : true,
            current_question : {},
            
            score : 0,
            question_list : [
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
            ],
            finished_question_index : [],
            examinee_ans : [],
        }
    }
    calculateResult(){
        let { finished_question_index, examinee_ans, question_list } = this.state;
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
        finished_question_index.forEach((item,idx)=>{
            let question = question_list[item];
            // query question answer to database
            let answer = question_answers[ question.id ];
            if( examinee_ans[idx] == answer ){
                counter += 1;
            }
        });
        this.setState({score:counter, isCalculating : false});
    }
    doTheCountDown(){
        let { countdown_timer, question_num } = this.state;
        if( countdown_timer > 0 ){
            this.setState({countdown_timer : countdown_timer - 1})
        }else{
            if( question_num < 5 ){
                this.generateQuestion();
            }else{
                this.updateAnswerInfo();
                this.setState({
                    isFinished : true
                });
                setTimeout(this.calculateResult.bind(this),2000);
            }
        }
    }
    updateAnswerInfo( idx ){
        let { question_list, finished_question_index, selectedAnswer, examinee_ans } = this.state;
        let obj = this.state;
        examinee_ans.push(parseInt(selectedAnswer));
        if(idx!==undefined){
            finished_question_index.push(idx);
            obj.current_question = question_list[idx];
            obj.finished_question_index = finished_question_index;
            obj.countdown_timer = this.max_timer;
            obj.question_num += 1;
            obj.selectedAnswer = -1;
        }
        obj.examinee_ans = examinee_ans;
        this.setState(obj);
        
    }
    generateRandomInt(){
        let { question_list } = this.state;
        return Math.floor(Math.random() * question_list.length);
    }
    generateQuestion(){
        let { finished_question_index, question_list, question_num, examinee_ans, selectedAnswer } = this.state;
        let idx =  this.generateRandomInt();
        console.log(finished_question_index, examinee_ans, selectedAnswer);
        if(this.interval) clearInterval(this.interval);
        while(true){
            if( finished_question_index.indexOf(idx) >= 0 ){
                idx = this.generateRandomInt();
            }else{
                this.updateAnswerInfo(idx);
                this.interval = setInterval( this.doTheCountDown.bind(this), 1000);
                break;
            }
        }
    }
    componentDidMount(){
        let { question_list } = this.state;
        this.interval = setInterval( this.doTheCountDown.bind(this), 1000);

        let idx = Math.floor(Math.random() * question_list.length); 
        this.setState({
            current_question : question_list[ idx ], 
            question_num : 1, finished_question_index : [idx],
            countdown_timer : this.max_timer
        });
    }
    onChangeAnswer(ev){
        let {value}=ev.target;
        this.setState({selectedAnswer:value})
    }
    constructOptions(){
        let { current_question, selectedAnswer } = this.state;
        let _arr = [];
        if( Object.keys(current_question).length){
            let { options } = current_question;
            options.forEach((item,idx)=>{
                _arr.push(
                    <Col className='radio-ipt-choices' key={idx}>
                        <input type='radio' checked={ selectedAnswer == idx } name='answer' value={idx} onChange={this.onChangeAnswer.bind(this)}/>
                        <label>{item}</label>
                    </Col>
                )
            });
        }
        return _arr;
    }
    render(){
        return(
            <div>
                <h2>{this.state.countdown_timer}</h2>
                <Modal show={this.state.isFinished} onHide={()=>{}}>
                    <Modal.Header >
                        <Modal.Title>Result</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {
                            this.state.isCalculating ? (
                                <p>Calculating result. Please wait . . . </p>
                            ) : ( <p>Your score is : { this.state.score } / 5 </p>)
                        }
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
                <div className='text-center'>
                    <p>{this.state.current_question.question} ( { this.state.question_num } out of 5)</p>
                    <hr/>
                    <Row>
                        { this.constructOptions() }
                    </Row>
                    <hr/>
                    <Row className='text-right'>
                        <Col>
                            <Button disabled={this.state.finished_question_index.length === 5} size="sm" type="button" variant="primary" onClick={this.generateQuestion.bind(this)}>Next</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}


