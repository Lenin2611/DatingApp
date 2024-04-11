using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class UserController : BaseController
    {
        private readonly DataContext _context;

        public UserController(DataContext context)
        {
            _context = context;
        }

        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetUsersAsync()
        {
            var list = await _context.Users.ToListAsync();
            if (list == null)
            {
                return BadRequest("Nothing in here.");
            }
            return Ok(list);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetUserByIdAsync(int id)
        {
            return Ok(await _context.Users.FindAsync(id));
        }

        [HttpDelete]
        public async Task<ActionResult<string>> DeleteUserAsync(string username)
        {
            var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == username);
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return Ok($"User {user.UserName} removed.");
        }
    }
}