using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using quizlandia_back.Models;
using Microsoft.EntityFrameworkCore;

public class QuestionSolved
{
    public int QuestionID { get; set; }
    public int? AnswerID { get; set; }
    public bool IsCorrect { get; set; }
};

namespace quizlandia_back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;

        public UsersController(DataContext context)
        {
            _context = context;
        }

        private async Task<List<object>> ProcessQuizSolvedsAsync(int quizID, List<QuizSolved> QSdata)
        {
            var quizSolveds = QSdata.Where(qs => qs.QuizID == quizID).ToList();
            var quizSolvedsArray = new List<object>();

            foreach (var qs in quizSolveds)
            {   
                System.Console.WriteLine(qs.QuestionSolveds);
                var questionSolveds = Newtonsoft.Json.JsonConvert.DeserializeObject<List<QuestionSolved>>(qs.QuestionSolveds);
                var questionSolvedsArray = new List<object>();

                foreach (var questionSolved in questionSolveds)
                {   
                    var fullQuestion = _context.QuizQuestions.Find(questionSolved.QuestionID).QuestionText;
                    var selectedAnswer = questionSolved.AnswerID == null ? null : _context.QuizAnswers.Find(questionSolved.AnswerID).AnswerText;

                    var otherAnswers = _context.QuizAnswers
                        .Where(qa => qa.QuestionID == questionSolved.QuestionID && qa.AnswerID != questionSolved.AnswerID)
                        .ToList();

                    var otherAnswersArray = new List<object>();
                    foreach (var oa in otherAnswers)
                    {
                        otherAnswersArray.Add(oa.AnswerText);
                    }

                    var correctAnswersArray = _context.QuizAnswers
                        .Where(qa => qa.QuestionID == questionSolved.QuestionID && qa.IsCorrect == true)
                        .Select(qa => qa.AnswerText)
                        .ToList();

                    var wrongAnswersArray = _context.QuizAnswers
                        .Where(qa => qa.QuestionID == questionSolved.QuestionID && qa.IsCorrect == false)
                        .Select(qa => qa.AnswerText)
                        .ToList();

                    var questionObject = new
                    {
                        question = fullQuestion,
                        selectedAnswer,
                        correctAnswersArray,
                        wrongAnswersArray,
                    };
                    questionSolvedsArray.Add(questionObject);
                }

                quizSolvedsArray.Add(new
                {
                    qs.QuizSolvedID,
                    qs.QuizID,
                    qs.SolverID,
                    qs.CorrectAnswerCount,
                    qs.TimeTaken,
                    qs.CreatedDate,
                    questions = questionSolvedsArray
                });
            }

            return quizSolvedsArray;
        }

        // POST: api/Users
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto createUserDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if a user with the same UserID or Email already exists
            var existingUser = await _context.UserInfos
                .FirstOrDefaultAsync(u => u.UserID == createUserDto.UserID || u.Email == createUserDto.Email);

            if (existingUser != null)
            {
                return Conflict("A user with the same UserID or Email already exists.");
            }

            var userInfo = new UserInfo
            {
                UserID = createUserDto.UserID,
                Name = createUserDto.Name,
                Surname = createUserDto.Surname,
                Email = createUserDto.Email,
                AccountType = createUserDto.AccountType,
                CreatedDate = DateTime.UtcNow,
                QuizCount = 0
            };

            _context.UserInfos.Add(userInfo);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetUserById), new { id = userInfo.UserID }, userInfo);
        }

        // GET: api/Users/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(string id)
        {
            var user = await _context.UserInfos.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpGet("{id}/stats/student")]
        public async Task<IActionResult> GetUserStudentStats(string id)
        {
            var user = await _context.UserInfos.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            if(user.AccountType != 1)
            {
                return BadRequest("User is not a student");
            }

            var QSdata = _context.QuizSolveds.Where(qs => qs.SolverID == id).ToList();

            List<int> quizIDs = new List<int>();
            foreach (var qs in QSdata)
            {
                if (!quizIDs.Contains(qs.QuizID))
                {
                    quizIDs.Add(qs.QuizID);
                }
            }

            var quizzes = _context.Quizzes
                .Where(q => quizIDs.Contains(q.QuizID))
                .Select(q => new
                {
                    q.QuizID,
                    q.CreatorId,
                    q.Title,
                    q.Description,
                    q.CreatedDate,
                    q.LastUpdateDate,
                    q.Status,
                    q.QuizCode,
                    q.SolvedCount,
                    q.TimeLimit
                })
                .ToList();

            // quizzes
            var quizObjects = new List<object>();

            foreach (var quiz in quizzes)
            {
                var quizSolveds = QSdata.Where(qs => qs.QuizID == quiz.QuizID).ToList();

                var quizSolvedsArray = new List<object>();
                foreach (var qs in quizSolveds)
                {
                    var questionSolveds = Newtonsoft.Json.JsonConvert.DeserializeObject<List<QuestionSolved>>(qs.QuestionSolveds);

                    var questionSolvedsArray = new List<object>();

                    foreach (var questionSolved in questionSolveds)
                    {   
                        var fullQuestion = _context.QuizQuestions.Find(questionSolved.QuestionID).QuestionText;

                        var selectedAnswer = _context.QuizAnswers.Find(questionSolved.AnswerID).AnswerText;

                        var otherAnswers = _context.QuizAnswers.Where(qa => qa.QuestionID == questionSolved.QuestionID && qa.AnswerID != questionSolved.AnswerID).ToList();

                        var otherAnswersArray = new List<object>();
                        foreach (var oa in otherAnswers)
                        {
                            otherAnswersArray.Add(oa.AnswerText);
                        }

                       var correctAnswersArray = _context.QuizAnswers
                            .Where(qa => qa.QuestionID == questionSolved.QuestionID && qa.IsCorrect == true)
                            .Select(qa => qa.AnswerText)
                            .ToList();

                        var wrongAnswersArray = _context.QuizAnswers
                            .Where(qa => qa.QuestionID == questionSolved.QuestionID && qa.IsCorrect == false)
                            .Select(qa => qa.AnswerText)
                            .ToList();

                        var questionObject = new
                        {
                            question = fullQuestion,
                            selectedAnswer,
                            correctAnswersArray,
                            wrongAnswersArray,
                        };
                        questionSolvedsArray.Add(questionObject);
                    }


                    quizSolvedsArray.Add(new
                    {
                        qs.QuizSolvedID,
                        qs.QuizID,
                        qs.SolverID,
                        qs.CorrectAnswerCount,
                        qs.TimeTaken,
                        qs.CreatedDate,
                        questions = questionSolvedsArray
                    });
                }

                var quizObject = new
                {
                    quiz.QuizID,
                    quiz.CreatorId,
                    quiz.Title,
                    quiz.Description,
                    quiz.CreatedDate,
                    quiz.LastUpdateDate,
                    quiz.Status,
                    quiz.QuizCode,
                    quiz.SolvedCount,
                    quiz.TimeLimit,
                    solveAttempts = quizSolvedsArray
                };
                quizObjects.Add(quizObject);
            }

            return Ok(new
            {
                user,
                quizObjects
            });
        }


        [HttpGet("{id}/stats/teacher")]
        public async Task<IActionResult> GetUserTeacherStats(string id)
        {

            var user = await _context.UserInfos.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            if(user.AccountType != 0)
            {
                return BadRequest("User is not a teacher");
            }

            var userCreatedQuizzes = _context.Quizzes.Where(qs => qs.CreatorId == user.UserID).ToList();
            if(userCreatedQuizzes.Count == 0)
            {
                return Ok(new
                {
                    user
                });
            }

            var quizObjects = new List<object>();

            foreach (var quiz in userCreatedQuizzes)
            {
                var QSdata = _context.QuizSolveds.Where(qs => qs.QuizID == quiz.QuizID).ToList();
                var quizID = quiz.QuizID;

                var quizSolvedsArray = await ProcessQuizSolvedsAsync(quiz.QuizID, QSdata);
                if(quizSolvedsArray.Count == 0){
                    continue;
                };
                
                var updatedQuizSolvedsArray = new List<object>();
                foreach (var quizSolved in quizSolvedsArray)
                {
                    dynamic quizSolvedDynamic = quizSolved;
                    var solver = await _context.UserInfos.FindAsync(quizSolvedDynamic.SolverID);
                    var fullSolverName = solver.Name + " " + solver.Surname;

                    var updatedQuizSolved = new
                    {
                        quizSolvedDynamic.QuizSolvedID,
                        // quizSolvedDynamic.QuizID,
                        // quizSolvedDynamic.SolverID,
                        quizSolvedDynamic.CorrectAnswerCount,
                        quizSolvedDynamic.TimeTaken,
                        quizSolvedDynamic.CreatedDate,
                        quizSolvedDynamic.questions,
                        fullSolverName
                    };

                    updatedQuizSolvedsArray.Add(updatedQuizSolved);
                }

                quizObjects.Add(new {
                    quiz.Title,
                    quiz.Description,
                    quiz.CreatedDate,
                    quiz.Status,
                    quiz.QuizCode,
                    quiz.SolvedCount,
                    quiz.TimeLimit,
                    quizSolveds = updatedQuizSolvedsArray});
            }


            return Ok(new
            {
                user,
                quizObjects
            });
        }
    }
}
