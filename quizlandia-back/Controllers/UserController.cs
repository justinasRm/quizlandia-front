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
    public class UsersController : ControllerBase
    {
        private readonly DataContext _context;

        public UsersController(DataContext context)
        {
            _context = context;
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

            return Ok(user);
        }

        [HttpGet("{id}/stats/teacher")]
        public async Task<IActionResult> GetUserTeacherStats(string id)
        {
            var user = await _context.UserInfos.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }
    }
}
