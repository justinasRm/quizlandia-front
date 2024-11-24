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
    public class QuizSolvedController : ControllerBase
    {
        private readonly DataContext _context;

        public QuizSolvedController(DataContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateQuizSolved([FromBody] CreateQuizSolvedDto createQuizSolvedDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the quiz exists
            var quiz = await _context.Quizzes.FindAsync(createQuizSolvedDto.QuizID);
            if (quiz == null)
            {
                return NotFound($"Quiz with ID {createQuizSolvedDto.QuizID} not found.");
            }

            // Check if the solver (user) exists
            var user = await _context.UserInfos.FindAsync(createQuizSolvedDto.SolverID);
            if (user == null)
            {
                return NotFound($"User with ID {createQuizSolvedDto.SolverID} not found.");
            }

            var quizSolved = new QuizSolved
            {
                QuizID = createQuizSolvedDto.QuizID,
                SolverID = createQuizSolvedDto.SolverID,
                CorrectAnswerCount = createQuizSolvedDto.CorrectAnswerCount,
                CreatedDate = DateTime.UtcNow,
                TimeTaken = createQuizSolvedDto.TimeTaken,
                QuestionSolveds = createQuizSolvedDto.QuestionSolveds
            };

            _context.QuizSolveds.Add(quizSolved);
            await _context.SaveChangesAsync();

            // Optionally, you can update the SolvedCount in the Quiz entity
            quiz.SolvedCount += 1;
            await _context.SaveChangesAsync();

            return Ok(quizSolved.QuizSolvedID);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuizSolvedById(int id)
        {
            var quizSolved = await _context.QuizSolveds.FindAsync(id);

            if (quizSolved == null)
            {
                return NotFound();
            }

            var quizSolvedDto = new QuizSolvedDto
            {
                QuizSolvedID = quizSolved.QuizSolvedID,
                QuizID = quizSolved.QuizID,
                SolverID = quizSolved.SolverID,
                CorrectAnswerCount = quizSolved.CorrectAnswerCount,
                TimeTaken = quizSolved.TimeTaken,
                CreatedDate = quizSolved.CreatedDate,
                QuestionSolveds = quizSolved.QuestionSolveds
            };

            return Ok(quizSolvedDto);
        }

        [HttpGet("ByQuiz/{quizId}")]
        public async Task<IActionResult> GetQuizSolvedByQuizId(int quizId)
        {
            var quizSolvedList = await _context.QuizSolveds
                .Where(qs => qs.QuizID == quizId)
                .Select(qs => new QuizSolvedDto
                {
                    QuizSolvedID = qs.QuizSolvedID,
                    QuizID = qs.QuizID,
                    SolverID = qs.SolverID,
                    CorrectAnswerCount = qs.CorrectAnswerCount,
                    TimeTaken = qs.TimeTaken,
                    CreatedDate = qs.CreatedDate,
                    QuestionSolveds = qs.QuestionSolveds
                })
                .ToListAsync();
            
            if (!quizSolvedList.Any())
            {
                return NotFound($"No quiz results found for QuizID {quizId}.");
            }

            return Ok(quizSolvedList);
        }

        // GET: api/QuizSolved/BySolver/{solverId}
        [HttpGet("BySolver/{solverId}")]
        public async Task<IActionResult> GetQuizSolvedBySolverId(string solverId)
        {
            var quizSolvedList = await _context.QuizSolveds
                .Where(qs => qs.SolverID == solverId)
                .Select(qs => new QuizSolvedDto
                {
                    QuizSolvedID = qs.QuizSolvedID,
                    QuizID = qs.QuizID,
                    SolverID = qs.SolverID,
                    CorrectAnswerCount = qs.CorrectAnswerCount,
                    TimeTaken = qs.TimeTaken,
                    CreatedDate = qs.CreatedDate,
                    QuestionSolveds = qs.QuestionSolveds
                })
                .ToListAsync();

            if (!quizSolvedList.Any())
            {
                return NotFound($"No quiz results found for SolverID '{solverId}'.");
            }

            return Ok(quizSolvedList);
        }

        // GET: api/QuizSolved/ByQuizAndSolver/{quizId}/{solverId}
        [HttpGet("ByQuizAndSolver/{quizId}/{solverId}")]
        public async Task<IActionResult> GetQuizSolvedByQuizAndSolver(int quizId, string solverId)
        {
            var quizSolved = await _context.QuizSolveds
                .FirstOrDefaultAsync(qs => qs.QuizID == quizId && qs.SolverID == solverId);

            if (quizSolved == null)
            {
                return NotFound($"No quiz result found for QuizID {quizId} and SolverID '{solverId}'.");
            }

            var quizSolvedDto = new QuizSolvedDto
            {
                QuizSolvedID = quizSolved.QuizSolvedID,
                QuizID = quizSolved.QuizID,
                SolverID = quizSolved.SolverID,
                CorrectAnswerCount = quizSolved.CorrectAnswerCount,
                TimeTaken = quizSolved.TimeTaken,
                CreatedDate = quizSolved.CreatedDate,
                QuestionSolveds = quizSolved.QuestionSolveds
            };

            return Ok(quizSolvedDto);
        }
    }
}