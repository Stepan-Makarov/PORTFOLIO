using Microsoft.Extensions.DependencyInjection;
using PortfolioLibrary.DataAccess;

namespace PortfolioApi.StartupConfig;

public static class DependencyInjectionExtensions
{
    public static void AddStandardServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen();
    }

    public static void AddCustomServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddSingleton<ISqliteDataAccess, SqliteDataAccess>();
        builder.Services.AddSingleton<IPortfolioData, PortfolioData>();
    }

    public static void AddHealthCheckServices(this WebApplicationBuilder builder)
    {
        builder.Services.AddHealthChecks()
            .AddSqlite(builder.Configuration.GetConnectionString("SqliteDB")!);
    }

    public static void AddCors(this WebApplicationBuilder builder)
    {
        builder.Services.AddCors(policy =>
        {
            policy.AddPolicy("OpenCorsPolicy", opt =>
                opt.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod());
        });
    }
}
