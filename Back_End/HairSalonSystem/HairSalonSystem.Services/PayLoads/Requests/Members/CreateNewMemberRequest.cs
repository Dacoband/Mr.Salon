﻿using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace HairSalonSystem.Services.PayLoads.Requests.Members
{
    public class CreateNewMemberRequest
    {
        [Required(ErrorMessage = "Email is missing")]
        [EmailAddress] // Ensure valid email format
        public required string Email { get; set; }

        [Required] // Password is required
        [StringLength(180, MinimumLength = 8)] 
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$",
             ErrorMessage = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.")]
        public required string Password { get; set; }

        [Required(ErrorMessage = "Member name is required")]
        [StringLength(100, ErrorMessage = "Member name must be less than 100 characters")]
        public required string MemberName { get; set; }

        [Required(ErrorMessage = "Date of birth is required")]
        [DataType(DataType.Date, ErrorMessage = "Invalid date format")]
        public DateTime DateOfBirth { get; set; }

        [Required(ErrorMessage = "Phone number is required")]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "Phone number must be exactly 10 digits")]
        [RegularExpression(@"^(03|05|07|08|09)\d{8}$", ErrorMessage = "Phone number must be a valid Vietnamese phone number")]

        public required string PhoneNumber { get; set; }

        [Required(ErrorMessage = "Address is required")]
        public string? Address { get; set; } 

        public IFormFile? AvatarImage { get; set; } 
    }
}
