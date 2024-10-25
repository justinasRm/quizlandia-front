using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using quizlandia_back.Models;
using Microsoft.EntityFrameworkCore;
namespace quizlandia_back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestAnsController : ControllerBase
    {
        private readonly DataContext _context;

        public QuestAnsController(DataContext context)
        {
            _context = context;
        }

        [HttpPost("quizCode/{quizCode}")]
        public async Task<IActionResult> AddQuestionsToQuiz(string quizCode, [FromBody] QuizQuestionsDto quizQuestionsDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the quiz by quizCode
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.QuizCode == quizCode);

            if (quiz == null)
            {
                return NotFound($"Quiz with code '{quizCode}' not found.");
            }

            // Map DTOs to entities and add them to the quiz
            var newQuestions = quizQuestionsDto.Questions.Select(q => new QuizQuestion
            {
                QuestionText = q.QuestionText,
                QuestionOrder = q.QuestionOrder,
                QuestionType = q.QuestionType,
                QuizID = quiz.QuizID,
                Answers = q.Answers?.Select(a => new QuizAnswer
                {
                    AnswerText = a.AnswerText,
                    IsCorrect = a.IsCorrect
                }).ToList()
            }).ToList();

            // Add the new questions to the quiz
            quiz.Questions.AddRange(newQuestions);

            // Save changes to the database
            await _context.SaveChangesAsync();

            // Prepare the response DTOs
            var addedQuestionsDto = newQuestions.Select(q => new QuizQuestionDto
            {
                QuestionText = q.QuestionText,
                QuestionOrder = q.QuestionOrder,
                QuestionType = q.QuestionType,
                Answers = q.Answers?.Select(a => new QuizAnswerDto
                {
                    AnswerText = a.AnswerText,
                    IsCorrect = a.IsCorrect
                }).ToList()
            }).ToList();

            return Ok(addedQuestionsDto);
        }

        
        [HttpGet("quizCode/{quizCode}")]
        public async Task<IActionResult> GetQuestionsWithAnswersByCode(string quizCode)
        {
            var quiz = await _context.Quizzes.FirstOrDefaultAsync(q => q.QuizCode == quizCode);

            if (quiz == null)
            {
                return NotFound();
            }

            var questions = await _context.QuizQuestions
                .Where(q => q.QuizID == quiz.QuizID)
                .Include(q => q.Answers)
                .ToListAsync();

            if (questions == null || !questions.Any())
            {
                return NotFound();
            }

            var questionsDto = questions.Select(q => new QuizQuestionDto
            {
                //QuestionID = q.QuestionID,
                QuestionText = q.QuestionText,
                QuestionOrder = q.QuestionOrder,
                QuestionType = q.QuestionType,
                Answers = q.Answers.Select(a => new QuizAnswerDto
                {
                   // AnswerID = a.AnswerID,
                    AnswerText = a.AnswerText,
                    IsCorrect = a.IsCorrect
                }).ToList()
            }).ToList();
            
            return Ok(questionsDto);
        }

        [HttpPost("{id}")]
        public async Task<IActionResult> AddQuestionsToQuiz(int id, [FromBody] QuizQuestionsDto quizQuestionsDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Find the quiz by quizCode
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                .FirstOrDefaultAsync(q => q.QuizID == id);

            if (quiz == null)
            {
                return NotFound($"Quiz with code '{id}' not found.");
            }

            // Map DTOs to entities and add them to the quiz
            var newQuestions = quizQuestionsDto.Questions.Select(q => new QuizQuestion
            {
                QuestionText = q.QuestionText,
                QuestionOrder = q.QuestionOrder,
                QuestionType = q.QuestionType,
                QuizID = quiz.QuizID,
                Answers = q.Answers?.Select(a => new QuizAnswer
                {
                    AnswerText = a.AnswerText,
                    IsCorrect = a.IsCorrect
                }).ToList()
            }).ToList();

            // Add the new questions to the quiz
            quiz.Questions.AddRange(newQuestions);

            // Save changes to the database
            await _context.SaveChangesAsync();

            // Prepare the response DTOs
            var addedQuestionsDto = newQuestions.Select(q => new QuizQuestionDto
            {
                QuestionText = q.QuestionText,
                QuestionOrder = q.QuestionOrder,
                QuestionType = q.QuestionType,
                Answers = q.Answers?.Select(a => new QuizAnswerDto
                {
                    AnswerText = a.AnswerText,
                    IsCorrect = a.IsCorrect
                }).ToList()
            }).ToList();

            return Ok(addedQuestionsDto);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuestionsWithAnswers(int id)
        {
            var questions = await _context.QuizQuestions
                .Where(q => q.QuizID == id)
                .Include(q => q.Answers)
                .ToListAsync();

            if (questions == null || !questions.Any())
            {
                return NotFound();
            }

            var questionsDto = questions.Select(q => new QuizQuestionDto
            {
                //QuestionID = q.QuestionID,
                QuestionText = q.QuestionText,
                QuestionOrder = q.QuestionOrder,
                QuestionType = q.QuestionType,
                Answers = q.Answers.Select(a => new QuizAnswerDto
                {
                    // AnswerID = a.AnswerID,
                    AnswerText = a.AnswerText,
                    IsCorrect = a.IsCorrect
                }).ToList()
            }).ToList();

            return Ok(questionsDto);
        }
    }
}
