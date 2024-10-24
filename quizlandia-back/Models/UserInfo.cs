using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace quizlandia_back.Models
{
    public class UserInfo
    {
        [Key]
        public string UserID { get; set; }

        [MaxLength(50)]
        public string? Name { get; set; }
        [MaxLength(50)]
        public string? Surname { get; set; }

        [Required]
        [MaxLength(50)]
        public string Email { get; set; }

        [Required]
        public bool AccountType { get; set; }

        [Required]
        public DateTime CreatedDate { get; set; }

        [Required]
        public int QuizCount { get; set; }
    }
}
