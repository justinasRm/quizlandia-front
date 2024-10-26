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
    public class QuizzesController : ControllerBase
    {
        private readonly DataContext _context;

        public QuizzesController(DataContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllQuizes()
        {
            var quiz = await _context.Quizzes.ToListAsync();

            if (quiz == null)
            {
                return NotFound();
            }

            return Ok(quiz);
        }

        // GET: api/Quizzes/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetQuizById(int id)
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.Answers)
                .FirstOrDefaultAsync(q => q.QuizID == id);

            if (quiz == null)
            {
                return NotFound();
            }

            return Ok(quiz);
        }

        [HttpGet("quizCode/{quizCode}")]
        public async Task<IActionResult> GetQuizByCode(string quizCode)
        {
            var quiz = await _context.Quizzes.FirstOrDefaultAsync(q => q.QuizCode == quizCode);

            if (quiz == null)
            {
                return NotFound();
            }

            return Ok(quiz);
        }

        [HttpGet("full")]
        public async Task<IActionResult> GetAllQuizesFull()
        {
            var quiz = await _context.Quizzes
                .Include(q => q.Questions)
                    .ThenInclude(q => q.Answers).ToListAsync();

            if (quiz == null)
            {
                return NotFound();
            }

            return Ok(quiz);
        }

        // POST: api/Quizzes
        [HttpPost]
        public async Task<IActionResult> CreateQuiz([FromBody] CreateQuizDto createQuizDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Check if the QuizCode already exists
            var existingQuiz = await _context.Quizzes
                .FirstOrDefaultAsync(q => q.QuizCode == createQuizDto.QuizCode);

            if (existingQuiz != null)
            {
                return Conflict("A quiz with the same QuizCode already exists.");
            }

            var quiz = new Quiz
            {
                CreatorId = createQuizDto.CreatorId,
                Title = createQuizDto.Title,
                Description = createQuizDto.Description,
                CreatedDate = DateTime.UtcNow,
                LastUpdateDate = DateTime.UtcNow,
                Status = createQuizDto.Status,
                QuizCode = createQuizDto.QuizCode,
                SolvedCount = 0,
                TimeLimit = createQuizDto.TimeLimit
            };

            _context.Quizzes.Add(quiz);
            await _context.SaveChangesAsync();


            return CreatedAtAction(nameof(GetQuizById), new { id = quiz.QuizID }, quiz);
        }
    }
}
