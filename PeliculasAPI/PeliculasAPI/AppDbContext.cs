﻿using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PeliculasAPI.Auth;
using PeliculasAPI.Entidades;

namespace PeliculasAPI
{
    public class AppDbContext: IdentityDbContext<IdentityUserApp>
    {
        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PeliculasActores>()
                .HasKey(x => new { x.PeliculaId, x.ActorId }); 
            
            modelBuilder.Entity<PeliculasGeneros>()
                .HasKey(x => new { x.PeliculaId, x.GeneroId });
            
            modelBuilder.Entity<PeliculasCines>()
                .HasKey(x => new { x.PeliculaId, x.CineId });

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Genero> Generos { get; set; }
        public DbSet<Actor> Actores { get; set; }
        public DbSet<Cine> Cines { get; set; }
        public DbSet<Pelicula> Peliculas { get; set; }
        public DbSet<PeliculasActores> PeliculasActores { get; set; }
        public DbSet<PeliculasGeneros> PeliculasGeneros { get; set; }
        public DbSet<PeliculasCines> PeliculasCines { get; set; }
        public DbSet<Rating> Ratings { get; set; }
    }
}
