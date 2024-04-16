using System.Security.Claims;
using API.Dtos;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class UserController : BaseController
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;

        public UserController(IUserRepository userRepository, IMapper mapper)
        {
            _userRepository = userRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsersAsync()
        {
            return Ok(await _userRepository.GetMembersAsync());
        }

        [HttpGet("id{id}")]
        public async Task<ActionResult<MemberDto>> GetUserByIdAsync(int id)
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            var mapped = _mapper.Map<MemberDto>(user);
            return Ok(mapped);
        }

        [HttpGet("username{username}")]
        public async Task<ActionResult<MemberDto>> GetUserByUsernameAsync(string username)
        {
            return await _userRepository.GetMemberByUsernameAsync(username);
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto)
        {
            var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userRepository.GetUserByUsernameAsync(username);
            if (user == null)
                return NotFound();
            _mapper.Map(memberUpdateDto, user);
            if (await _userRepository.SaveAllAsync())
                return NoContent();
            return BadRequest("Failed to update user.");
        } 

        [HttpDelete]
        public async Task<ActionResult<string>> DeleteUserAsync(string username)
        {
            var user = await _userRepository.GetUserByUsernameAsync(username);
            _userRepository.RemoveUser(user);
            await _userRepository.SaveAllAsync();
            return Ok($"User {user.UserName} removed.");
        }
    }
}