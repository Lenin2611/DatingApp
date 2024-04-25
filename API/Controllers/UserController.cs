using API.Dtos;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class UserController : BaseController
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;

        public UserController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
            _photoService = photoService;
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<MemberDto>>> GetUsers([FromQuery]UserParams userParams)
        {
            var gender = await _unitOfWork.UserRepository.GetUserGender(User.GetUsername());
            userParams.CurrentUsername = User.GetUsername();
            if (string.IsNullOrEmpty(userParams.Gender))
            {
                userParams.Gender = gender == "male" ? "female" : "male";
            }
            var users = await _unitOfWork.UserRepository.GetMembersAsync(userParams);
            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalPages, users.TotalCount));
            return Ok(users);
        }

        [HttpGet("{username}")]
        public async Task<ActionResult<MemberDto>> GetUserByUsername(string username)
        {
            return await _unitOfWork.UserRepository.GetMemberByUsernameAsync(username);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            if (user == null)
                return NotFound();
            _mapper.Map(memberUpdateDto, user);
            if (await _unitOfWork.Complete())
                return NoContent();
            return BadRequest("Failed to update user.");
        } 

        [HttpDelete]
        public async Task<ActionResult<string>> DeleteUser(string username)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
            _unitOfWork.UserRepository.RemoveUser(user);
            await _unitOfWork.Complete();
            return Ok($"User {user.UserName} removed.");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPhoto(IFormFile file)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            if (user == null)
                return NotFound();
            var result = await _photoService.AddPhotoAsync(file);
            if (result.Error != null) 
                BadRequest(result.Error.Message);
            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };
            if (user.Photos.Count == 0)
                photo.IsMain = true;
            user.Photos.Add(photo);
            if (await _unitOfWork.Complete())
                return CreatedAtAction(nameof(GetUserByUsername),
                    new { username = user.UserName },
                    _mapper.Map<PhotoDto>(photo));
            return BadRequest("Problems while adding the photo.");
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            if (user == null)
                NotFound();
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null)
                return NotFound();
            if (photo.IsMain)
                return BadRequest("This is already your main photo.");
            var currentMain = user.Photos.First(x => x.IsMain);
            if (currentMain != null)
                currentMain.IsMain = false;
            photo.IsMain = true;
            if (await _unitOfWork.Complete())
                return NoContent();
            return BadRequest("Problems while setting main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUsername());
            if (user == null)
                NotFound();
            var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
            if (photo == null)
                return NotFound();
            if (photo.IsMain)
                return BadRequest("You cannot delete your main photo.");
            if (photo.PublicId != null)
            {
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null)
                    return BadRequest(result.Error.Message);
            }
            user.Photos.Remove(photo);
            if (await _unitOfWork.Complete())
                return Ok();
            return BadRequest("Problems while deleting the photo.");
        }
    }
}