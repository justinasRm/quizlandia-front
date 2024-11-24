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
  const userIdFromRedux = useSelector(state => state.auth.uid);


useEffect(() => {
  if (finishing) {
    return; // Stop the timer if finishing is true
  }

  if (timeLeft > 0) {
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timerId);
  } else if (timeLeft === 0) {
    finish(); 
  }
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
      console.log('quizSolvedPost:');
      console.log(quizSolvedPost)

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
    // cia reiktu highlightint teisingus atsakymus
  }

  function leave() {
    window.location.href = '/';
  }
    
  if (!quizData) {
    return <div>Loading...</div>;
  }




    return (
      <div style={{ marginBottom: 50 }}>
       <Dialog
        open={watchMode || timeLeft !== 0 ? false : true}
        TransitionComponent={Transition}
        // keepMounted
        aria-describedby="alert-dialog-slide-description"
        >
          <h2 style={{ textAlign: 'center', padding: 10 }}>Jūsų laikas baigėsi! Atsakymai buvo išsaugoti.</h2>
          <h3 style={{ textAlign: 'center' }}>Teisingai atsakytų klausimų skaičius: {getCorrectAnswersCount()}</h3>
          <Button onClick={()=>{viewAnswers()}} >Peržiūrėti atsakymus</Button>
          <Button onClick={() => { leave() }}>Išeiti</Button>
      </Dialog>


        <Typography variant="h4" component="h1" gutterBottom style={{ textAlign: 'center' }}>Klausimynas: {quizData.title}</Typography>
        
        {quizData &&
        <div style={{position: 'fixed', bottom: 0, left: 0, width: '100%', display: 'flex', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)'}}>
          <text style={{fontSize: 20}}>Liko laiko: {formatTime(timeLeft)}</text>
        </div>
          }

        {quizData && quizData.questions && quizData.questions.map(question => (
        <Card key={question.questionID} variant="outlined" style={{ marginBottom: '20px' }}>
          <CardContent>
            <FormControl component="fieldset">
              <h4 style={{fontSize: 30, margin: 0, fontWeight: 500}}>{question.questionText}</h4>
              <RadioGroup
                aria-label={`question-${question.questionID}`}
                name={`question-${question.questionID}`}
                value={selectedAnswers[question.questionID] || ''}
                onChange={(e) => handleAnswerChange(question.questionID, e.target.value)}
              >
                {question.answers.map(answer => (
                  <FormControlLabel
                    key={answer.answerID}
                    value={answer.answerID}
                    control={<Radio />}
                    label={answer.answerText}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      ))}
      <Button onClick={()=>{finish()}} variant="contained" color="primary" style={{ marginTop: '20px' }}>
        Baigti
      </Button>
      </div>
        
  );
}

export default SolveQuiz;