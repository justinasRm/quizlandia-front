import React, { useEffect, useState } from 'react';
import { Dialog, Button } from '@mui/material';
import { backEndpoint } from '../envs';
import { ReactComponent as EditIcon } from './../assets/icons/edit.svg';
import { ReactComponent as DeleteIcon } from './../assets/icons/delete.svg';

const UserQuizzes = ({ userId }) => {

    const [quizData, setQuizData] = React.useState([]);
    const [openDialogId, setOpenDialogId] = useState(null);

    const handleOpen = (quizId) => {
        setOpenDialogId(quizId);
    };

    const handleClose = () => {
        setOpenDialogId(null);
    };

    const deleteQuiz = async () => {

        if (!openDialogId) return;

        try {
            const response = await fetch(`${backEndpoint.deleteQuiz}?creatorId=${encodeURIComponent(userId)}&quizId=${encodeURIComponent(openDialogId)}`, {
                method: "DELETE",
            });

            if (!response.ok) {
              throw new Error('Failed to fetch quizzes');
            }

            //TODO remove later 
            console.log('deleted successfully');

            setQuizData((quizData) =>
                quizData.filter((quiz) => quiz.quizID !== openDialogId)
            );

            setOpenDialogId(null);
          } catch (err) {
            console.log(err.message);
          }
    }

    const openQuiz = quizData.find((quiz) => quiz.quizID === openDialogId);

    useEffect(() => {

        const fetchQuizzes = async () => {
          try {
            const response = await fetch(`${backEndpoint.deleteQuiz}?creatorId=${encodeURIComponent(userId)}`);
            if (!response.ok) {
              throw new Error('Failed to fetch quizzes');
            }
            const data = await response.json();
            setQuizData(data);

            //TODO Quiz data. remove later 
            console.log(data);
          } catch (err) {
            console.log(err.message);
          }
        };
    
        fetchQuizzes();
      }, []);

    return (
        <div style={{display: "flex", flexDirection: "column", alignItems: "center", gap: "20px"}}>
            {quizData.map((quiz, index) => (
                <div key={quiz.quizID} style={{ width: "50%", border: "1px solid black", padding: "15px"}}>
                    <div style={{ display: "flex", "justifyContent": "space-between"}}>
                        <div style={{ display: "flex", gap: "15px"}}>
                            <span style={{ fontWeight: "600"}}>{index + 1}#</span>
                            <span><i>{quiz.title}</i></span>
                        </div>
                        <div style={{ display: "flex", gap: "10px", alignItems: "center"}}>
                            <EditIcon />
                            <DeleteIcon onClick={() => handleOpen(quiz.quizID)} style={{ cursor: 'pointer' }}  />
                        </div>
                    </div>
                    <p>{quiz.description}</p>
                    <div style={{ display: "flex", gap: "20px"}}>
                        <div>
                            <span style={{ marginRight: "5px" }}>Spręsta:</span>
                            <span>{quiz.solvedCount}</span>
                        </div>
                        <div>
                            <span style={{ marginRight: "5px" }}>Klausimai:</span>
                            <span>0</span>
                        </div>
                    </div>
                </div>
            ))}

            {openQuiz && 
                <Dialog open={openDialogId !== null} onClose={handleClose}>
                    <div style={{ padding: "20px" }}>
                        <h2>
                            Ar tikrai norite ištrinti viktoriną "{openQuiz.title}"?
                        </h2>
                        <div style={{display: "flex", gap:"20px"}}>
                            <Button onClick={deleteQuiz} style={{flex:"1"}} variant="contained" color="error">
                                Taip
                            </Button>
                            <Button onClick={handleClose} style={{flex:"1"}} variant="contained">
                                Ne
                            </Button>
                        </div>
                    </div>
                </Dialog>
            }
        </div>
    )
}

export default UserQuizzes;