import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    IconButton,
    Card,
    CardContent,
    CardActions,
    Grid,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import QuizIcon from '@mui/icons-material/Quiz'; // Using MUI's built-in Quiz icon
import { backEndpoint } from '../envs';

const UserQuizzes = ({ userId }) => {
    const [quizData, setQuizData] = useState([]);
    const [openDialogId, setOpenDialogId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleOpen = (quizId) => {
        setOpenDialogId(quizId);
    };

    const handleClose = () => {
        setOpenDialogId(null);
    };

    const handleSnackbarClose = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const deleteQuiz = async () => {
        if (!openDialogId) return;

        try {
            const response = await fetch(`${backEndpoint.deleteQuiz}?creatorId=${encodeURIComponent(userId)}&quizId=${encodeURIComponent(openDialogId)}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error('Failed to delete the quiz.');
            }

            // Remove the deleted quiz from the state
            setQuizData((prevQuizzes) =>
                prevQuizzes.filter((quiz) => quiz.quizID !== openDialogId)
            );

            setSnackbar({ open: true, message: 'Klausimynas sėkmingai ištrintas!', severity: 'success' });
            setOpenDialogId(null);
        } catch (err) {
            console.error('Error deleting quiz:', err.message);
            setSnackbar({ open: true, message: 'Klaida trynant klausimyną.', severity: 'error' });
        }
    };

    const openQuiz = quizData.find((quiz) => quiz.quizID === openDialogId);

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await fetch(`${backEndpoint.deleteQuiz}?creatorId=${encodeURIComponent(userId)}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch quizzes.');
                }
                const data = await response.json();
                setQuizData(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching quizzes:', err.message);
                setLoading(false);
                setSnackbar({ open: true, message: 'Klaida kraunant klausimynus.', severity: 'error' });
            }
        };

        fetchQuizzes();
    }, [userId]);

    return (
        <div
            style={{
                padding: '2rem',
                backgroundColor: '#f5f6f7',
                minHeight: '100vh',
            }}
        >
            <Typography variant="h4" align="center" gutterBottom>
                Jūsų Sukurti Klausimynai
            </Typography>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <CircularProgress color="primary" />
                    <Typography variant="h6" color="textSecondary" sx={{ marginLeft: '1rem' }}>
                        Kraunama...
                    </Typography>
                </div>
            ) : (
                <Grid container spacing={4}>
                    {quizData.length > 0 ? (
                        quizData.map((quiz, index) => (
                            <Grid item xs={12} sm={6} md={4} key={quiz.quizID}>
                                <Card
                                    sx={{
                                        borderRadius: '12px',
                                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                        transition: 'transform 0.2s',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        },
                                    }}
                                >
                                    <CardContent sx={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <QuizIcon fontSize="large" color="primary" />
                                            <Typography variant="h6" sx={{ color: '#007BFF' }}>
                                                {quiz.title}
                                            </Typography>
                                        </div>
                                        <Typography sx={{ fontSize: '1rem', color: '#555', marginTop: '0.5rem' }}>
                                            {quiz.description}
                                        </Typography>
                                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem' }}>
                                            <Typography variant="body2" sx={{ fontWeight: '500', color: '#333' }}>
                                                <strong>Spręsta:</strong> {quiz.solvedCount}
                                            </Typography>
                                        </div>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: 'space-between', padding: '0 1.5rem 1.5rem 1.5rem' }}>
                                        <IconButton aria-label="delete" onClick={() => handleOpen(quiz.quizID)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <Typography variant="h6" align="center" color="textSecondary">
                                Jūs neturite sukurtų klausimynų.
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDialogId !== null} onClose={handleClose}>
                <DialogTitle>
                    Ar tikrai norite ištrinti šį klausimyną?
                </DialogTitle>
                {openQuiz && (
                    <DialogContent sx={{ padding: '2rem', textAlign: 'center' }}>
                        <Typography variant="body1">
                            Klausimynas: <strong>{openQuiz.title}</strong>
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ marginTop: '0.5rem' }}>
                            Šio veiksmo anuliuoti negalima.
                        </Typography>
                    </DialogContent>
                )}
                <DialogActions sx={{ display: 'flex', justifyContent: 'center', gap: '1rem', padding: '1.5rem' }}>
                    <Button onClick={deleteQuiz} variant="contained" color="error" sx={{ flex: '1' }}>
                        Taip
                    </Button>
                    <Button onClick={handleClose} variant="contained" color="primary" sx={{ flex: '1' }}>
                        Ne
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for Notifications */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default UserQuizzes;
