using System;
using System.ComponentModel.DataAnnotations;

namespace quizlandia_back
{
    public class CreateUserDto
    {
        [Required]
        public string UserID { get; set; }

        [MaxLength(50)]
        public string Name { get; set; }

        [MaxLength(50)]
        public string Surname { get; set; }

        [Required]
        [MaxLength(50)]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public bool AccountType { get; set; }
    }
}
