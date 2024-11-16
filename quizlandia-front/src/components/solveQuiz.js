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
    outOfTime(); 
  }
}, [timeLeft, finishing]);


  function outOfTime() {
    console.log('Time is up!');
    finish();
  }

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


      const quizSolvedPost = {
        quizID: quizData.quizID,
        solverID: userIdFromRedux,
        correctAnswerCount: correctAnswersCount,
        timetaken: formatTime(`${convertToSeconds(quizData.timeLimit) - timeLeft}`),
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
    // ok - cia papostina quiz, bet duomenyse nera parodyta, kurios klausimus atsake. Tik bendras gerai atsakytu klausimu kiekis. Bet statistika dabar is karto po kvizo issprendimo rodyt galima. 

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
     // Normalize selectedAnswers for easier processing
    const answers = Object.entries(selectedAnswers).map(([questionID, answerID]) => ({
        questionID,
        answerID: parseInt(answerID) // User can only select one answer
    }));
    // Process quiz data to count correct answers
    const correctAnswersCount = quizData.questions.reduce((acc, question) => {
        // Get all correct answers for the current question
        const correctAnswerIDs = question.answers
            .filter(answer => answer.isCorrect)
            .map(answer => answer.answerID);

        // Get the user's selected answer for the current question
        const userSelectedAnswer = answers.find(
            userAnswer => parseInt(userAnswer.questionID) === question.questionID
        )?.answerID;

        // Check if the user's selected answer is among the correct answers
        const isCorrect = userSelectedAnswer !== undefined && correctAnswerIDs.includes(userSelectedAnswer);

        // Increment count if the user's answer is correct
        return acc + (isCorrect ? 1 : 0);
    }, 0);

    return correctAnswersCount;
  }
    
  if (!quizData) {
    return <div>Loading...</div>;
  }




    return (
      <div style={{ marginBottom: 50 }}>
       <Dialog
        open={timeLeft === 0 ? true : false}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        >
          <h2 style={{textAlign: 'center', padding: 10}}>Jūsų laikas baigėsi!</h2>
          <Button onClick={() => { finish() }}>Baigti klausimyną</Button>
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



// {
//   "quizID": 4,
//   "creatorId": "bambam",
//   "title": "string",
//   "description": "string",
//   "createdDate": "2024-10-24T18:58:40.5913343",
//   "status": 0,
//   "quizCode": "123456789a",
//   "solvedCount": 0,
//   "questions": [
//     {
//       "questionID": 1,
//       "quizID": 4,
//       "questionText": "firstQ",
//       "questionOrder": 0,
//       "questionType": 0,
//       "answers": [
//         {
//           "answerID": 1,
//           "questionID": 0,
//           "answerText": "string",
//           "isCorrect": true
//         }
//       ]
//     },
//     {
//       "questionID": 2,
//       "quizID": 4,
//       "questionText": "string",
//       "questionOrder": 1,
//       "questionType": 0,
//       "answers": [
//         {
//           "answerID": 2,
//           "questionID": 0,
//           "answerText": "string",
//           "isCorrect": false
//         }
//       ]
//     }
//   ]
// }