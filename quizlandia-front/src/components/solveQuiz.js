import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { backEndpoint } from '../envs';
import { Card, CardContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography, Button, Dialog, Slide } from '@mui/material';
import { useSelector } from 'react-redux';

function SolveQuiz() {
  const convertToSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const { id } = useParams(); // Get the :id parameter from the route
  const [quizData, setQuizData] = useState(null);
  const [finishing, setFinishing] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [watchMode, setWatchMode] = useState(false);
  const [finishingDoublecheck, setFinishingDoublecheck] = useState(false);
  const userIdFromRedux = useSelector(state => state.auth.uid);


useEffect(() => {
  if (finishing) {
    return;
  }

  if (timeLeft === 0 && !finishing) {
    finish();
    return; 
  }

  const timerId = setInterval(() => {
    setTimeLeft(prevTime => Math.max(prevTime - 1, 0));
  }, 1000);

  return () => clearInterval(timerId);
}, [timeLeft, finishing]);



    useEffect(() => {
        fetch(backEndpoint.getQuizByCode + id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json().then(data => { console.log(data); setQuizData(data); }))
            .catch((err) => {
                if (err && err.errors && err.errors.id) {
                    console.log('Quiz not found');

            }
        })
   
    }, [id]);
  
  useEffect(() => {
    if(quizData && quizData.timeLimit) {
      setTimeLeft(convertToSeconds(quizData.timeLimit));
    }
  },[quizData])
  
   useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
   }, []);

  function finish() {
    setFinishing(true);
    const correctAnswersCount = getCorrectAnswersCount();

    
    const QSs = quizData.questions.map(question => {
      const selectedAnswerID = selectedAnswers[question.questionID];
      const selectedAnswer = question.answers.find(answer => answer.answerID === parseInt(selectedAnswerID));
      return {
        questionID: question.questionID,
        answerID: selectedAnswer ? selectedAnswer.answerID : null,
        isCorrect: !selectedAnswer || !selectedAnswer.isCorrect ? 0 : 1
      };
    });
    
      const quizSolvedPost = {
        quizID: quizData.quizID,
        solverID: userIdFromRedux,
        correctAnswerCount: correctAnswersCount,
        timetaken: formatTime(`${convertToSeconds(quizData.timeLimit) - timeLeft}`),
        QuestionSolveds: JSON.stringify(QSs),
      }

    const postQuizSolved = () => {
      fetch(backEndpoint.quizSolved, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(quizSolvedPost)
      }).then(res => res.json().then(data => {
        console.log('result is:')
        console.log(data);
      }))
      .catch((err) => {
        console.error('Error:', err);
      });
    }
    
    postQuizSolved();
    }
    
      const handleAnswerChange = (questionID, answerID) => {
    setSelectedAnswers(prevState => ({
      ...prevState,
      [questionID]: answerID
    }));
      };
  
  
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });
  
  
  
  function getCorrectAnswersCount() {
    const answers = Object.entries(selectedAnswers).map(([questionID, answerID]) => ({
        questionID,
        answerID: parseInt(answerID)
    }));
    const correctAnswersCount = quizData.questions.reduce((acc, question) => {
        const correctAnswerIDs = question.answers
            .filter(answer => answer.isCorrect)
            .map(answer => answer.answerID);

        const userSelectedAnswer = answers.find(
            userAnswer => parseInt(userAnswer.questionID) === question.questionID
        )?.answerID;

        const isCorrect = userSelectedAnswer !== undefined && correctAnswerIDs.includes(userSelectedAnswer);

        return acc + (isCorrect ? 1 : 0);
    }, 0);

    return correctAnswersCount;
  }


  function viewAnswers() {
    setWatchMode(true);
  }

  function leave() {
    window.location.href = '/';
  }
    
  if (!quizData) {
    return <div>Loading...</div>;
  }




    return (
      <div style={{ marginBottom: 50 }}>
        {!watchMode && (timeLeft === 0 || finishing) &&
          <Dialog
            open={!watchMode && (timeLeft === 0 || finishing) ? true : false}
            TransitionComponent={Transition}
            aria-describedby="alert-dialog-slide-description"
            keepMounted={false}
          >
            <h2 style={{ textAlign: 'center', padding: 10 }}>Jūsų laikas baigėsi! Atsakymai buvo išsaugoti.</h2>
            <h3 style={{ textAlign: 'center' }}>Teisingai atsakytų klausimų skaičius: {getCorrectAnswersCount()}</h3>
            <Button onClick={() => { viewAnswers() }} >Peržiūrėti atsakymus</Button>
            <Button onClick={() => { leave() }}>Išeiti</Button>
          </Dialog>}


        <Typography variant="h4" component="h1" gutterBottom style={{ textAlign: 'center' }}>Klausimynas: {quizData.title}</Typography>
        
        {quizData && !watchMode &&
        <div style={{position: 'fixed', bottom: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)'}}>
          <text style={{fontSize: 20}}>Liko laiko: {formatTime(timeLeft)}</text>
        </div>
          }

        {quizData && quizData.questions && quizData.questions.map(question => (
          <Card key={question.questionID} variant="outlined" style={{ marginBottom: '20px' }}>
            <CardContent>
              <FormControl component="fieldset">
                <h4 style={{ fontSize: 30, margin: 0, fontWeight: 500 }}>{question.questionText}</h4>
                <RadioGroup
                  aria-label={`question-${question.questionID}`}
                  name={`question-${question.questionID}`}
                  value={selectedAnswers[question.questionID] || ''}
                  onChange={(e) => handleAnswerChange(question.questionID, e.target.value)}
                >
                  {question.answers.map(answer => {
                    // Determine if the answer is selected and correct
                    const isSelected = selectedAnswers[question.questionID] == answer.answerID;
                    const isCorrect = answer.isCorrect;

                    let answerStyle = {};
                    let radioStyle = {};

                    if (watchMode) {
                      answerStyle.color = isCorrect ? 'green' : 'red'; 
                      radioStyle.color = isCorrect ? 'green' : 'red';
                    }

                    if (isSelected) {
                      answerStyle.fontWeight = 'bold';
                    }

                    return (
                      <FormControlLabel
                        key={answer.answerID}
                        value={answer.answerID}
                        control={
                          <Radio
                            sx={{
                              '&.Mui-checked': radioStyle,
                              '&.Mui-disabled': radioStyle,
                            }}
                            checked={isSelected}
                            disabled={watchMode}
                          />
                        }
                        label={
                          <span style={answerStyle}>{answer.answerText}</span>
                        }
                      />
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>




      ))}
        <Button disabled={watchMode} onClick={() => { setFinishingDoublecheck(true) }} variant="contained" color="primary" style={{ marginTop: '20px' }}>
        Baigti
        </Button>
        <Dialog
          open={!watchMode &&(finishingDoublecheck && timeLeft !== 0 && !finishing)}
          onClose={() => { setFinishingDoublecheck(false) }}
          aria-describedby="alert-dialog-slide-description"
        >
          <h2 style={{ textAlign: 'center' }}>Ar tikrai norite baigti?</h2>
          <Button onClick={() => { finish() }} variant="contained">Taip</Button>
          <Button onClick={() => { setFinishingDoublecheck(false) }}>Ne</Button>
        </Dialog>

        {watchMode && <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', textAlign: 'center' }}><Button style={{fontSize: 22}} fullWidth variant='contained' onClick={()=>{ leave() }} >Išeiti</Button></div>}
      </div>
        
  );
}

export default SolveQuiz;