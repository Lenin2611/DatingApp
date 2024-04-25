using API.Dtos;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController : BaseController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly ITokenService _tokenService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IMapper _mapper;

        public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IUnitOfWork unitOfWork, IMapper mapper)
        {
            _userManager = userManager;
            _tokenService = tokenService;
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<AppUser>> RegisterUserAsync(RegisterDto registerDto)
        {
            if (await UserExistsAsync(registerDto.Username))
                return BadRequest("Username is taken.");
            var user = _mapper.Map<AppUser>(registerDto);
            user.UserName = registerDto.Username.ToLower();
            var result = await _userManager.CreateAsync(user, registerDto.Password);
            if (!result.Succeeded)
                return BadRequest(result.Errors);
            var roleResult = await _userManager.AddToRoleAsync(user, "Member");
            if (!roleResult.Succeeded)
                return BadRequest(result.Errors);
            return Ok(new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                KnownAs = user.KnownAs,
                Gender = user.Gender
            });
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<UserDto>> LoginUserAsync(LoginDto loginDto)
        {
            var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(loginDto.Username);
            if (user == null)
                return Unauthorized("Invalid username.");
            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);
            if (!result)
                return Unauthorized("Invalid password.");
            return Ok(new UserDto
            {
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                KnownAs = user.KnownAs,
                Gender = user.Gender
            });
        }

        private async Task<bool> UserExistsAsync(string username)
        {
            return await _userManager.Users.AnyAsync(x => x.UserName == username.ToLower());
        }
    }
}