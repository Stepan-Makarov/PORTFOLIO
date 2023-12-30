using Dapper;
using Microsoft.Extensions.Configuration;
using System.Data;
using System.Data.SQLite;

namespace PortfolioLibrary.DataAccess;

public class SqliteDataAccess : ISqliteDataAccess
{
    private readonly IConfiguration _config;

    public SqliteDataAccess(IConfiguration config)
    {
        _config = config;
    }

    public async Task<List<T>> LoadData<T, U>(
        string sqlStatement,
        U parameters,
        string connectionStringName)
    {
        // Потом заменить на try catch, чтобы не бросать новое исключение.
        string connectionString = _config.GetConnectionString(connectionStringName) 
            ?? throw new InvalidOperationException($"Connection string '{connectionStringName}' not found.");

        using IDbConnection connection = new SQLiteConnection(connectionString);

        var rows = await connection.QueryAsync<T>(sqlStatement, parameters);

        return rows.ToList();
    }

    public async Task SaveData<T>(
        string sqlStatement,
        T parameters, string
        connectionStringName)
    {
        // Потом заменить на try catch, чтобы не бросать новое исключение.
        string connectionString = _config.GetConnectionString(connectionStringName) 
            ?? throw new InvalidOperationException($"Connection string '{connectionStringName}' not found.");

        using IDbConnection connection = new SQLiteConnection(connectionString);

        await connection.ExecuteAsync(sqlStatement, parameters);
    }
}
