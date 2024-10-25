import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { backEndpoint } from '../envs';
import { Card, CardContent, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Typography, Button } from '@mui/material';
function SolveQuiz() {
  const { id } = useParams(); // Get the :id parameter from the route
  const [quizData, setQuizData] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState({});

    useEffect(() => {
        fetch(backEndpoint.getOneQuiz + 5, {
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

    function finish() {
        console.log('selectedAnswers:', selectedAnswers);
    }
    
      const handleAnswerChange = (questionID, answerID) => {
    setSelectedAnswers(prevState => ({
      ...prevState,
      [questionID]: answerID
    }));
  };

  if (!quizData) {
    return <div>Loading...</div>;
  }

    return (
      <div>
      <Typography variant="h4" component="h1" gutterBottom style={{textAlign: 'center'}}>Klausimynas: {quizData.title}</Typography>
        
      {quizData.questions.map(question => (
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