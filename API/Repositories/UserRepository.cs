using API.Data;
using API.Dtos;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<AppUser> _userManager;

        public UserRepository(DataContext context, IMapper mapper, UserManager<AppUser> userManager)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
        }

        public UserRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<MemberDto> GetMemberByUsernameAsync(string username, string currentUser)
        {
            var query = _context.Users
                .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                .AsQueryable();
            if (username == currentUser)
                query = query.IgnoreQueryFilters();
            var member = await query.FirstOrDefaultAsync(x => x.UserName == username);
            return member;
        }

        public async Task<AppUser> GetMemberByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = _context.Users.AsQueryable();
            query = query.Where(u => u.UserName != userParams.CurrentUsername);
            query = query.Where(u => u.Gender == userParams.Gender);
            var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge - 1));
            var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));
            query = query.Where(u => u.DateOfBirth >= minDob && u.DateOfBirth <= maxDob);
            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(u => u.Created),
                _ => query.OrderByDescending(u => u.LastActive)
            };
            return await PagedList<MemberDto>.CreateAsync(
                    query.AsNoTracking().ProjectTo<MemberDto>(_mapper.ConfigurationProvider),
                    userParams.PageNumber,
                    userParams.PageSize
                );
        }

        public async Task<AppUser> GetUserByUsernameAsync(string username)
        {
            return await _context.Users
                .Include(p => p.Photos)
                .IgnoreQueryFilters()
                .FirstOrDefaultAsync(x => x.UserName == username);
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
            return await _context.Users
                .Include(p => p.Photos)
                .ToListAsync();
        }

        public void RemoveUser(AppUser user)
        {
            _context.Remove(user);
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }

        public async Task<string> GetUserGender(string username)
        {
            return await _context.Users
                .Where(x => x.UserName == username)
                .Select(x => x.Gender)
                .FirstOrDefaultAsync();
        }

        public async Task<AppUser> GetUserByPhotoId(int photoId)
        {
            var result = await (from user in _context.Users
                                join photo in _context.Photos on user.Id equals photo.AppUserId
                                where photo.Id == photoId
                                select user)
                                    .IgnoreQueryFilters()
                                    .FirstOrDefaultAsync();
            var photos = await (from photo in _context.Photos
                                where photo.AppUserId == result.Id
                                select photo)
                                    .IgnoreQueryFilters()
                                    .ToListAsync();

            
            return result;
        }
    }
}