﻿using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HairSalonSystem.Services.PayLoads.Requests.Stylists
{
    public class CreateStylistRequest
    {
        [Required(ErrorMessage = "Email is missing")]
        [EmailAddress] 
        public required string Email { get; set; }

        [Required] 
        [StringLength(180, MinimumLength = 8)]
        [RegularExpression(@"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$",
             ErrorMessage = "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.")]
        public required string Password { get; set; }
        [Required]
        public Guid BranchID { get; set; }
        [Required]
        public Guid StaffStylistId { get; set; }
        [Required]
        [StringLength(100, ErrorMessage = "Stylist name must be at most 100 characters long.")]
        public required string StylistName { get; set; }
        public double AverageRating { get; set; } = 0;
        [Required]
        [RegularExpression(@"^[0-9]{10}$", ErrorMessage = "Phone number must be exactly 10 digits.")]
        public required string PhoneNumber { get; set; }
        public string? Address { get; set; }
        public IFormFile? AvatarImage { get; set; }
    }
}
