using API.Dtos;
using API.Entities;

namespace API.Interfaces
{
    public interface IPhotoRepository
    {
        Task<List<PhotoForApprovalDto>> GetUnapprovedPhotosAsync();
        Task<Photo> GetPhotoByIdAsync(int photoId);
        void RemovePhoto(Photo photo);
    }
}