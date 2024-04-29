using API.Data;
using API.Dtos;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class PhotoRepository : IPhotoRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;

        public PhotoRepository(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<Photo> GetPhotoByIdAsync(int photoId)
        {
            return await _context.Photos
            .IgnoreQueryFilters()
            .FirstOrDefaultAsync(x => x.Id == photoId);
        }

        public async Task<List<PhotoForApprovalDto>> GetUnapprovedPhotosAsync()
        {
            return await _context.Photos
            .ProjectTo<PhotoForApprovalDto>(_mapper.ConfigurationProvider)
            .Where(x => !x.IsApproved)
            .IgnoreQueryFilters()
            .ToListAsync();
        }

        public void RemovePhoto(Photo photo)
        {
            _context.Photos.Remove(photo);
        }
    }
}