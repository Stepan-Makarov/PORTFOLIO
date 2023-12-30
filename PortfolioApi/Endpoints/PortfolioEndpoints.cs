using Microsoft.AspNetCore.Mvc;
using PortfolioLibrary.DataAccess;
using static PortfolioApi.Models.Records;

namespace PortfolioApi.Endpoints;

public static class PortfolioEndpoints
{
    public static void AddPortfolioEndpoints(this WebApplication app)
    {
        var portfolioApi = app.MapGroup("/api/portfolio");
        portfolioApi.MapGet("/projects", LoadProjectsDataAsync);
        portfolioApi.MapPost("/messages", SaveMessageAsync);
        portfolioApi.MapGet("/messages", LoadMessagesAsync);

        app.UseCors("OpenCorsPolicy");

        app.MapHealthChecks("/health");
    }

    private async static Task<IResult> LoadProjectsDataAsync(IPortfolioData data)
    {
        var output = await data.GetAllProjectsAsync();
        return Results.Ok(output);
    }

    private async static Task<IResult> SaveMessageAsync(IPortfolioData data, [FromBody] MessageData messageData)
    {
        await data.SaveMessage(messageData.senderName, messageData.senderEmail, messageData.senderMessage);
        return Results.Ok();
    }

    private async static Task<IResult> LoadMessagesAsync(IPortfolioData data)
    {
        var output = await data.GetAllMessages();
        return Results.Ok(output);
    }
}