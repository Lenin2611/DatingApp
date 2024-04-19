﻿using API.Entities;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }

    public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike> Likes { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.Entity<UserLike>().HasKey(x => new{ x.SourceUserId, x.TargetUserId });
        builder.Entity<UserLike>().HasOne(x => x.SourceUser).WithMany(x => x.LikedUsers).HasForeignKey(x => x.SourceUserId).OnDelete(DeleteBehavior.Cascade);
        builder.Entity<UserLike>().HasOne(x => x.TargetUser).WithMany(x => x.LikedByUsers).HasForeignKey(x => x.TargetUserId).OnDelete(DeleteBehavior.NoAction);
    }
}
