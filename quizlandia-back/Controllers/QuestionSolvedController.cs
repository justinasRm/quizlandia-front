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

            // Check if the Solver (user) exists
            var solver = await _context.UserInfos.FindAsync(createQuestionSolvedDto.SolverID);
            if (solver == null)
            {
                return NotFound($"User with ID '{createQuestionSolvedDto.SolverID}' not found.");
            }

            // Create new QuestionSolved entity
            var questionSolved = new QuestionSolved
            {
                QuestionID = createQuestionSolvedDto.QuestionID,
                QuizSolvedID = createQuestionSolvedDto.QuizSolvedID,
                SolverID = createQuestionSolvedDto.SolverID,
                CorrectlySolved = createQuestionSolvedDto.CorrectlySolved
            };

            // Add to context and save changes
            _context.QuestionSolveds.Add(questionSolved);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetQuestionSolvedById), new { questionId = questionSolved.QuestionID, quizSolvedId = questionSolved.QuizSolvedID }, questionSolved);
        }

        // GET: api/QuestionSolved/{id}
        [HttpGet("{questionId}/{quizSolvedId}")]
        public async Task<IActionResult> GetQuestionSolvedById(int questionId, int quizSolvedId)
        {
            var questionSolved = await _context.QuestionSolveds.FindAsync(questionId, quizSolvedId);

            if (questionSolved == null)
            {
                return NotFound();
            }

            var questionSolvedDto = new QuestionSolvedDto
            {
                QuestionID = questionSolved.QuestionID,
                QuizSolvedID = questionSolved.QuizSolvedID,
                SolverID = questionSolved.SolverID,
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
                    SolverID = qs.SolverID,
                    CorrectlySolved = qs.CorrectlySolved
                })
                .ToListAsync();

            if (!questionsSolved.Any())
            {
                return NotFound($"No questions solved found for QuizSolvedID {quizSolvedId}.");
            }

            return Ok(questionsSolved);
        }

        // GET: api/QuestionSolved/BySolver/{solverId}
        [HttpGet("BySolver/{solverId}")]
        public async Task<IActionResult> GetQuestionsSolvedBySolverId(string solverId)
        {
            var questionsSolved = await _context.QuestionSolveds
                .Where(qs => qs.SolverID == solverId)
                .Select(qs => new QuestionSolvedDto
                {
                    QuestionID = qs.QuestionID,
                    QuizSolvedID = qs.QuizSolvedID,
                    SolverID = qs.SolverID,
                    CorrectlySolved = qs.CorrectlySolved
                })
                .ToListAsync();

            if (!questionsSolved.Any())
            {
                return NotFound($"No questions solved found for SolverID '{solverId}'.");
            }

            return Ok(questionsSolved);
        }

        // GET: api/QuestionSolved/ByQuizSolvedAndSolver/{quizSolvedId}/{solverId}
        [HttpGet("ByQuizSolvedAndSolver/{quizSolvedId}/{solverId}")]
        public async Task<IActionResult> GetQuestionSolvedByQuizSolvedAndSolver(int quizSolvedId, string solverId)
        {
            var questionSolved = await _context.QuestionSolveds
                .FirstOrDefaultAsync(qs => qs.QuizSolvedID == quizSolvedId && qs.SolverID == solverId);

            if (questionSolved == null)
            {
                return NotFound($"No question solved found for QuizSolvedID {quizSolvedId} and SolverID '{solverId}'.");
            }

            var questionSolvedDto = new QuestionSolvedDto
            {
                QuestionID = questionSolved.QuestionID,
                QuizSolvedID = questionSolved.QuizSolvedID,
                SolverID = questionSolved.SolverID,
                CorrectlySolved = questionSolved.CorrectlySolved
            };

            return Ok(questionSolvedDto);
        }
    }
}
