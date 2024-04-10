using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace API.Controllers
{
    public class UserController : BaseController
    {
        private readonly DataContext _context;

        public UserController(DataContext context)
        {
            _context = context;
        }

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

        [HttpPost]
        public async Task<ActionResult<string>> PostUserAsync(AppUser user)
        {
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return Ok($"{user} added.");
        }
    }
}