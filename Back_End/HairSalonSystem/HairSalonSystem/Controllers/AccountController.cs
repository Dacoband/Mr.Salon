﻿using Amazon.Runtime.Internal;
using HairSalonSystem.API.Constant;
using HairSalonSystem.API.DTOs;
using HairSalonSystem.API.PayLoads;
using HairSalonSystem.API.PayLoads.Requests;
using HairSalonSystem.API.PayLoads.Requests.Accounts;
using HairSalonSystem.API.PayLoads.Responses.Accounts;
using HairSalonSystem.API.Util;
using HairSalonSystem.BusinessObject.Entities;
using HairSalonSystem.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace HairSalonSystem.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly IAccountService _accountService;
        private readonly IAuthService _authService;

        public AccountController(IAccountService accountService, IAuthService authService)
        {
            _accountService = accountService;
            _authService = authService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Account>> GetAccountById(Guid id)
        {
            var account = await _accountService.GetAccountById(id);
            if (account == null)
            {
                return NotFound();
            }
            return Ok(account);
        }

        [HttpGet]
        public async Task<ActionResult<List<Account>>> GetAllAccounts()
        {
            var accounts = await _accountService.GetAllAccounts();
            return Ok(accounts);
        }

        

        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateAccount(Guid id, [FromBody] Account accountDto)
        {
            if (id != accountDto.AccountId)
            {
                return BadRequest();
            }

            var account = new Account
            {
                AccountId = id,
                Email = accountDto.Email,
                Password = PasswordUtil.HashPassword(accountDto.Password),
                RoleName = accountDto.RoleName
            };
            await _accountService.UpdateAccount(account);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> RemoveAccount(Guid id)
        {
            await _accountService.RemoveAccount(id);
            return NoContent();
        }


        [HttpPost(APIEndPointConstant.Authentication.Login)]
        [ProducesResponseType(typeof(LoginResponse), StatusCodes.Status200OK)]
        [ProducesErrorResponseType(typeof(UnauthorizedObjectResult))]
       
        public async Task<ActionResult<string>> Login([FromBody] LoginRequest request)
        {
            var account = await _authService.Authenticate(request.Email, PasswordUtil.HashPassword(request.Password));
            if (account == null)
            {
                return Unauthorized(new PayLoads.ErrorResponse()
                {
                    StatusCode = StatusCodes.Status401Unauthorized,
                    Error = MessageConstant.LoginMessage.InvalidUsernameOrPassword,
                    TimeStamp = DateTime.Now
                });
            }

            var token = await _authService.GenerateJwtToken(account);
            var loginResponse = new LoginResponse
            {
                Token = token,
                Email = account.Email,
                RoleName = account.RoleName
            };
            return Ok(loginResponse);
        }
    }
}