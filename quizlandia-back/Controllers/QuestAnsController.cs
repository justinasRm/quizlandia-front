using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quizlandia_back.Models;
using System.Threading.Tasks;

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


        [HttpGet("{quizId}")]
        public async Task<IActionResult> GetQuestionsWithAnswers(int quizId)
        {
            var questions = await _context.QuizQuestions
                .Where(q => q.QuizID == quizId)
                .Include(q => q.Answers)
                .ToListAsync();

            if (questions == null || !questions.Any())
            {
                return NotFound();
            }

            var questionsDto = questions.Select(q => new QuizQuestionDto
            {
                QuestionID = q.QuestionID,
                QuestionText = q.QuestionText,
                QuestionOrder = q.QuestionOrder,
                QuestionType = q.QuestionType,
                Answers = q.Answers.Select(a => new QuizAnswerDto
                {
                    AnswerID = a.AnswerID,
                    AnswerText = a.AnswerText,
                    IsCorrect = a.IsCorrect
                }).ToList()
            }).ToList();

            return Ok(questionsDto);
        }
    }
}
