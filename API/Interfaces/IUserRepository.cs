using API.Dtos;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);
        Task<IEnumerable<AppUser>> GetUsersAsync();
        Task<AppUser> GetUserByUsernameAsync(string username);
        void RemoveUser(AppUser user);
        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
        Task<MemberDto> GetMemberByUsernameAsync(string username, string CurrentUser);
        Task<AppUser> GetMemberByIdAsync(int id);
        Task<string> GetUserGender(string username);
        Task<AppUser> GetUserByPhotoId(int photoId);
    }
}