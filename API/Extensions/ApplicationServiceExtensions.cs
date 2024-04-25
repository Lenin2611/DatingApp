using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Repositories;
using API.Services;
using API.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<DataContext>(option =>
            {
                option.UseSqlServer(configuration.GetConnectionString("ConexSQLServer"));
            });

            services.AddCors((option) =>
            {
                option.AddPolicy("CorsPolicy", option =>
                {
                    option
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials()
                        .WithOrigins("https://localhost:4200");
                });
            });

            services.AddScoped<ITokenService, TokenService>();

            services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

            services.Configure<CloudinarySettings>(configuration.GetSection("CloudinarySettings"));

            services.AddScoped<IPhotoService, PhotoService>();

            services.AddScoped<LogUserActivity>();

            services.AddRazorPages();

            services.AddServerSideBlazor();

            services.AddSignalR(e => {
                e.MaximumReceiveMessageSize = 102400000;
            });

            services.AddSingleton<PresenceTracker>();

            services.AddScoped<IUnitOfWork, UnitOfWork>();

            return services;
        }
    }
}