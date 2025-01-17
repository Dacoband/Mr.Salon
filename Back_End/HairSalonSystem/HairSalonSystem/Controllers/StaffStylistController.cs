﻿using HairSalonSystem.Services.Constant;
using HairSalonSystem.Services.Interfaces;
using HairSalonSystem.Services.PayLoads.Requests.StaffStylists;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace HairSalonSystem.API.Controllers
{
    [ApiController]
    [Route(APIEndPointConstant.StaffStylist.StaffStylistEndpoint)]
    public class StaffStylistController : ControllerBase
    {
        private readonly IStaffStylistService _staffStylistService;

        public StaffStylistController(IStaffStylistService staffStylistService)
        {
            _staffStylistService = staffStylistService;
        }

        
        [HttpPost]
        [Route(APIEndPointConstant.StaffStylist.AddStaffStylist)]
        public async Task<IActionResult> CreateStaffStylist([FromForm] CreateStaffStylistRequest request)
        {
            var result = await _staffStylistService.CreateStaffStylistAsync(request, HttpContext);
            return Ok(result);
        }

        [HttpGet]
        [Route(APIEndPointConstant.StaffStylist.GetStaffStylistById)]
        public async Task<IActionResult> GetStaffStylistById(Guid id)
        {
            var result = await _staffStylistService.GetStaffStylistByIdAsync(id);
            return Ok(result);
        }

        [HttpGet]
        [Route(APIEndPointConstant.StaffStylist.GetStaffStylistByAccountId)]
        public async Task<IActionResult> GetStaffStylistByAccountId(Guid accountId)
        {
            var result = await _staffStylistService.GetStaffStylistByAccountIdAsync(accountId);
            return Ok(result);
        }

        [HttpGet]
        [Route(APIEndPointConstant.StaffStylist.GetAllStaffStylists)]
        public async Task<IActionResult> GetAllStaffStylists()
        {
            var result = await _staffStylistService.GetAllStaffStylistsAsync();
            return Ok(result);
        }

        [HttpPut]
        [Route(APIEndPointConstant.StaffStylist.UpdateStaffStylist)]
        public async Task<IActionResult> UpdateStaffStylist([FromRoute] Guid id, [FromForm] UpdateStaffStylistRequest request)
        {
            await _staffStylistService.UpdateStaffStylistAsync(id, request,HttpContext);
            return Ok(new { Message = MessageConstant.StaffStylistMessage.StaffStylistUpdated });
        }

        [HttpDelete]
        [Authorize(Roles = "SA,SM")] 
        [Route(APIEndPointConstant.StaffStylist.DeleteStaffStylist)]
        public async Task<IActionResult> DeleteStaffStylist(Guid id)
        {
            await _staffStylistService.DeleteStaffStylistAsync(id);
            return Ok(new { Message = MessageConstant.StaffStylistMessage.StaffStylistDeleted });
        }

        [HttpGet]
        [Route(APIEndPointConstant.StaffStylist.GetStaffStylistByBranchId)]
        public async Task<IActionResult> GetStaffStylistsByBranchId(Guid branchId)
        {
            var result = await _staffStylistService.GetStaffStylistsByBranchIdAsync(branchId);
            return Ok(result);
        }
    }
}
