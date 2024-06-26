﻿using API.Entities;
using API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext : IdentityDbContext<AppUser, AppRole, int, IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, IdentityRoleClaim<int>, IdentityUserToken<int>>
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<UserLike> Likes { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Group> Groups { get; set; }
    public DbSet<Connection> Connections { get; set; }
    public DbSet<Photo> Photos { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<AppUser>().HasMany(x => x.UserRoles).WithOne(x => x.User).HasForeignKey(x => x.UserId).IsRequired();
        builder.Entity<AppRole>().HasMany(x => x.UserRoles).WithOne(x => x.Role).HasForeignKey(x => x.RoleId).IsRequired();
        builder.Entity<UserLike>().HasKey(x => new{ x.SourceUserId, x.TargetUserId });
        builder.Entity<UserLike>().HasOne(x => x.SourceUser).WithMany(x => x.LikedUsers).HasForeignKey(x => x.SourceUserId).OnDelete(DeleteBehavior.Cascade);
        builder.Entity<UserLike>().HasOne(x => x.TargetUser).WithMany(x => x.LikedByUsers).HasForeignKey(x => x.TargetUserId).OnDelete(DeleteBehavior.NoAction);
        builder.Entity<Message>().HasOne(x => x.Recipient).WithMany(x => x.MessagesReceived).OnDelete(DeleteBehavior.Restrict);
        builder.Entity<Message>().HasOne(x => x.Sender).WithMany(x => x.MessagesSent).OnDelete(DeleteBehavior.Restrict);
        builder.Entity<Photo>().HasOne(x => x.AppUser).WithMany(x => x.Photos).HasForeignKey(x => x.AppUserId);
        builder.Entity<Photo>().HasQueryFilter(x => x.IsApproved);
    }
}
