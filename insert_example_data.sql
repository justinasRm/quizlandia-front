USE [quizappdb]
GO
-- Insert data into UserInfo table (No identity columns)
INSERT INTO UserInfos (UserID, Name, Surname, Email, AccountType, CreatedDate, QuizCount)
VALUES 
('user1', 'Alice', 'Smith', 'alice@example.com', 1, '2021-01-01', 2),
('user2', 'Bob', 'Johnson', 'bob@example.com', 1, '2021-01-02', 1),
('user3', 'Charlie', 'Brown', 'charlie@example.com', 1, '2021-01-03', 0),
('user4', 'Diana', 'Prince', 'diana@example.com', 1, '2021-01-04', 0);

-- Enable IDENTITY_INSERT for Quiz table
SET IDENTITY_INSERT Quizzes ON;

-- Insert data into Quiz table
INSERT INTO Quizzes (QuizID, CreatorId, Title, Description, CreatedDate, LastUpdateDate, Status, QuizCode, SolvedCount, TimeLimit)
VALUES 
(1, 'user1', 'Math Quiz', 'Basic math quiz', '2021-01-10', '2021-01-10', 1, 'MATH1', 5, '00:30:00'),
(2, 'user1', 'Science Quiz', 'Basic science quiz', '2021-01-15', '2021-01-15', 1, 'SCI1', 3, '00:20:00');

-- Disable IDENTITY_INSERT for Quiz table
SET IDENTITY_INSERT Quizzes OFF;

-- Enable IDENTITY_INSERT for QuizQuestion table
SET IDENTITY_INSERT QuizQuestions ON;

-- Insert data into QuizQuestion table
INSERT INTO QuizQuestions (QuestionID, QuizID, QuestionText, QuestionOrder, QuestionType)
VALUES 
(1, 1, 'What is 2+2?', 1, 1),
(2, 1, 'What is 3*3?', 2, 1),
(3, 2, 'What planet is known as the Red Planet?', 1, 1);

-- Disable IDENTITY_INSERT for QuizQuestion table
SET IDENTITY_INSERT QuizQuestions OFF;

-- Enable IDENTITY_INSERT for QuizAnswer table
SET IDENTITY_INSERT QuizAnswers ON;

-- Insert data into QuizAnswer table
INSERT INTO QuizAnswers (AnswerID, QuestionID, AnswerText, IsCorrect)
VALUES 
(1, 1, '3', 0),
(2, 1, '4', 1),
(3, 1, '5', 0),
(4, 2, '6', 0),
(5, 2, '9', 1),
(6, 2, '12', 0),
(7, 3, 'Earth', 0),
(8, 3, 'Mars', 1),
(9, 3, 'Jupiter', 0);

-- Disable IDENTITY_INSERT for QuizAnswer table
SET IDENTITY_INSERT QuizAnswers OFF;

-- Enable IDENTITY_INSERT for QuizSolved table
SET IDENTITY_INSERT QuizSolveds ON;

-- Insert data into QuizSolved table
INSERT INTO QuizSolveds (QuizSolvedID, QuizID, SolverID, CorrectAnswerCount, CreatedDate, TimeTaken)
VALUES 
(1, 1, 'user2', 1, '2021-01-20', '00:10:00'),
(2, 1, 'user3', 2, '2021-01-21', '00:08:00'),
(3, 2, 'user4', 1, '2021-01-22', '00:12:00'),
(4, 2, 'user2', 0, '2021-01-23', '00:15:00');

-- Disable IDENTITY_INSERT for QuizSolved table
SET IDENTITY_INSERT QuizSolveds OFF;

-- Enable IDENTITY_INSERT for QuestionSolved table
SET IDENTITY_INSERT QuestionSolveds ON;

-- Insert data into QuestionSolved table
INSERT INTO QuestionSolveds (QSID, QuestionID, QuizSolvedID, CorrectlySolved)
VALUES 
(1, 1, 1, 1),  -- user2's attempt at question 1 in QuizSolvedID 1
(2, 2, 1, 0),  -- user2's attempt at question 2 in QuizSolvedID 1
(3, 1, 2, 1),  -- user3's attempt at question 1 in QuizSolvedID 2
(4, 2, 2, 1),  -- user3's attempt at question 2 in QuizSolvedID 2
(5, 3, 3, 1),  -- user4's attempt at question 3 in QuizSolvedID 3
(6, 3, 4, 0);  -- user2's attempt at question 3 in QuizSolvedID 4

-- Disable IDENTITY_INSERT for QuestionSolved table
SET IDENTITY_INSERT QuestionSolveds OFF;
