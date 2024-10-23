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
            var allQuizRecords = await _context.Quizzes.ToListAsync(); // Quizzes.Include(q => q.Questions)
            return Ok(allQuizRecords);
        }
    }
}
