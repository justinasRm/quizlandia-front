using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using quizlandia_back.Models;
using System.Threading.Tasks;

namespace quizlandia_back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuizController : ControllerBase
    {
        private readonly DataContext _context;

        public QuizController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQuizzes()
        {
            var allQuizRecords = await _context.Quizzes.ToListAsync();

            if (allQuizRecords == null)
            {
                return NotFound();
            }

            return Ok(allQuizRecords);
        }

        // need to get quiz by its ID
        // need to create quiz
        // need to update quiz

        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuizById(int id)
        {
            var quiz = await _context.Quizzes.FirstOrDefaultAsync(q => q.QuizID == id); //.Include(q => q.Questions).FirstOrDefaultAsync(q => q.QuizID == id);

            if (quiz == null)
            {
                return NotFound();
            }

            var quizDto = new QuizDto
            {
                QuizCode = quiz.QuizCode,
                CreatorId = quiz.CreatorId,
                Title = quiz.Title,
                Description = quiz.Description,
                CreatedDate = quiz.CreatedDate,
                Status = quiz.Status
            };

            return Ok(quizDto);
        }

        [HttpGet("code/{code}")]
        public async Task<IActionResult> GetQuizByCode(string code)
        {
            var quiz = await _context.Quizzes.FirstOrDefaultAsync(q => q.QuizCode == code); //.Include(q => q.Questions).FirstOrDefaultAsync(q => q.QuizID == id);

            if (quiz == null)
            {
                return NotFound();
            }

            var quizDto = new QuizDto
            {
                QuizCode = quiz.QuizCode,
                CreatorId = quiz.CreatorId,
                Title = quiz.Title,
                Description = quiz.Description,
                CreatedDate = quiz.CreatedDate,
                Status = quiz.Status
            };

            return Ok(quizDto);
        }

        [HttpGet("fullquiz/{id}")]
        public async Task<IActionResult> GetFullQuizById(int id)
        {
            var quiz = await _context.Quizzes.Include(q => q.Questions).FirstOrDefaultAsync(q => q.QuizID == id);

            if (quiz == null)
            {
                return NotFound();
            }

            var quizDto = new FullQuizDto
            {
                QuizCode = quiz.QuizCode,
                CreatorId = quiz.CreatorId,
                Title = quiz.Title,
                Description = quiz.Description,
                CreatedDate = quiz.CreatedDate,
                Status = quiz.Status,
                Questions = quiz.Questions?.Select(q => new QuizQuestionDto
                {
                    QuestionID = q.QuestionID,
                    QuestionText = q.QuestionText,
                    QuestionOrder = q.QuestionOrder,
                    QuestionType = q.QuestionType,
                    Answers = q.Answers?.Select(a => new QuizAnswerDto
                    {
                        AnswerID = a.AnswerID,
                        AnswerText = a.AnswerText,
                        IsCorrect = a.IsCorrect
                    }).ToList()
                }).ToList()
            };

            return Ok(quizDto);
        }

        [HttpGet("fullquiz/code/{code}")]
        public async Task<IActionResult> GetFullQuizByCode(string code)
        {
            var quiz = await _context.Quizzes.Include(q => q.Questions).FirstOrDefaultAsync(q => q.QuizCode == code);

            if (quiz == null)
            {
                return NotFound();
            }

            var quizDto = new FullQuizDto
            {
                QuizCode = quiz.QuizCode,
                CreatorId = quiz.CreatorId,
                Title = quiz.Title,
                Description = quiz.Description,
                CreatedDate = quiz.CreatedDate,
                Status = quiz.Status,
                Questions = quiz.Questions?.Select(q => new QuizQuestionDto
                {
                    QuestionID = q.QuestionID,
                    QuestionText = q.QuestionText,
                    QuestionOrder = q.QuestionOrder,
                    QuestionType = q.QuestionType,
                    Answers = q.Answers?.Select(a => new QuizAnswerDto
                    {
                        AnswerID = a.AnswerID,
                        AnswerText = a.AnswerText,
                        IsCorrect = a.IsCorrect
                    }).ToList()
                }).ToList()
            };

            return Ok(quizDto);
        }

        
        /*
        [HttpPost("quizWithQuestion")]
        public async Task<IActionResult> CreateQuizWithQuestions([FromBody] QuizDto quiz)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuizByCode), new { id = quiz.QuizCode }, quiz);
        }*/

        [HttpPost("quiz")]
        public async Task<IActionResult> CreateQuiz([FromBody] QuizDto quizDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var quiz = new Quiz
            {
                QuizCode = quizDto.QuizCode,
                CreatorId = quizDto.CreatorId,
                Title = quizDto.Title,
                Description = quizDto.Description,
                CreatedDate = DateTime.UtcNow,
                Status = quizDto.Status
            };

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuizById), new { id = quiz.QuizID }, quiz);
        }
    }
}
