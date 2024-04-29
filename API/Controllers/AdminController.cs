using API.Data;
using API.Dtos;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUnitOfWork _unitOfWork;

        public AdminController(UserManager<AppUser> userManager, IUnitOfWork unitOfWork)
        {
            _userManager = userManager;
            _unitOfWork = unitOfWork;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _userManager.Users.OrderBy(x => x.UserName).Select(x => new
            {
                x.Id,
                Username = x.UserName,
                Roles = x.UserRoles.Select(x => x.Role.Name).ToList()
            }).ToListAsync();
            return Ok(users);
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditRoles(string username, [FromQuery]string roles)
        {
            if (string.IsNullOrEmpty(roles))
                return BadRequest("You must select at least one role");
            var selectedRoles = roles.Split(",").ToArray();
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
                return NotFound();
            var userRoles = await _userManager.GetRolesAsync(user);
            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
            if (!result.Succeeded)
                return BadRequest("Failed to add roles");
            result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
            if (!result.Succeeded)
                return BadRequest("Failed to remove roles");
            return Ok(await _userManager.GetRolesAsync(user));
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpGet("photo-to-moderate")]
        public async Task<ActionResult<List<PhotoForApprovalDto>>> GetPhotosForApproval()
        {
            return await _unitOfWork.PhotoRepository.GetUnapprovedPhotosAsync();
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpPut("approve-photo/{id}")]
        public async Task<ActionResult> AprovePhoto(int id)
        {
            var photo = await _unitOfWork.PhotoRepository.GetPhotoByIdAsync(id);
            if (photo == null)
                return NotFound();
            if (photo.IsApproved)
                return BadRequest("This photo is already approved");
            var user = await _unitOfWork.UserRepository.GetUserByPhotoId(id);
            if (user == null)
                return BadRequest("No user");
            if (!user.Photos.Any(x => x.IsMain))
                photo.IsMain = true;
            photo.IsApproved = true;
            if (await _unitOfWork.Complete())
            {
                return NoContent();
            }
            return BadRequest("Problems approving photo");
        }

        [Authorize(Policy = "ModeratePhotoRole")]
        [HttpDelete("reject-photo/{id}")]
        public async Task<ActionResult> RemovePhoto(int id)
        {
            var photo = await _unitOfWork.PhotoRepository.GetPhotoByIdAsync(id);
            if (photo == null)
                return NotFound();
            if (photo.IsApproved)
                return BadRequest("This photo is approved");
            _unitOfWork.PhotoRepository.RemovePhoto(photo);
            return Ok();
        }
    }
}