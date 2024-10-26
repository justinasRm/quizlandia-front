using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using quizlandia_back.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;

namespace quizlandia_back.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionSolvedController : ControllerBase
    {
        private readonly DataContext _context;

        public QuestionSolvedController(DataContext context)
        {
            _context = context;
        }
        
        // POST: api/QuestionSolved
        [HttpPost]
        public async Task<IActionResult> CreateQuestionSolved([FromBody] CreateQuestionSolvedDto createQuestionSolvedDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the QuizSolved exists
            var quizSolved = await _context.QuizSolveds.FindAsync(createQuestionSolvedDto.QuizSolvedID);
            if (quizSolved == null)
            {
                return NotFound($"QuizSolved with ID {createQuestionSolvedDto.QuizSolvedID} not found.");
            }

            // Check if the QuizQuestion exists
            var quizQuestion = await _context.QuizQuestions.FindAsync(createQuestionSolvedDto.QuestionID);
            if (quizSolved == null)
            {
                return NotFound($"Question of this solved quiz with ID {createQuestionSolvedDto.QuestionID} not found.");
            }
            
            // Create new QuestionSolved entity
            var questionSolved = new QuestionSolved
            {
                QuestionID = createQuestionSolvedDto.QuestionID,
                QuizSolvedID = createQuestionSolvedDto.QuizSolvedID,
                CorrectlySolved = createQuestionSolvedDto.CorrectlySolved
            };

            // Add to context and save changes
            _context.QuestionSolveds.Add(questionSolved);
            await _context.SaveChangesAsync();

            return Ok(questionSolved);
        }

        // GET: api/QuestionSolved/{id}
        [HttpGet("{questionId}/{quizSolvedId}")]
        public async Task<IActionResult> GetQuestionSolvedById(int QSID)
        {
            var questionSolved = await _context.QuestionSolveds.FindAsync(QSID);

            if (questionSolved == null)
            {
                return NotFound();
            }

            var questionSolvedDto = new QuestionSolvedDto
            {
                QuestionID = questionSolved.QuestionID,
                QuizSolvedID = questionSolved.QuizSolvedID,
                CorrectlySolved = questionSolved.CorrectlySolved
            };

            return Ok(questionSolvedDto);
        }


        // GET: api/QuestionSolved/ByQuizSolved/{quizSolvedId}
        [HttpGet("ByQuizSolved/{quizSolvedId}")]
        public async Task<IActionResult> GetQuestionsSolvedByQuizSolvedId(int quizSolvedId)
        {
            var questionsSolved = await _context.QuestionSolveds
                .Where(qs => qs.QuizSolvedID == quizSolvedId)
                .Select(qs => new QuestionSolvedDto
                {
                    QuestionID = qs.QuestionID,
                    QuizSolvedID = qs.QuizSolvedID,
                    CorrectlySolved = qs.CorrectlySolved
                })
                .ToListAsync();

            if (!questionsSolved.Any())
            {
                return NotFound($"No questions solved found for QuizSolvedID {quizSolvedId}.");
            }

            return Ok(questionsSolved);
        }
    }
}
