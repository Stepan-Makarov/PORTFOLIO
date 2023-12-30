using PortfolioLibrary.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortfolioLibrary.DataAccess;

public class PortfolioData : IPortfolioData
{
    private readonly ISqliteDataAccess _sqlite;
    private const string connectionStringName = "SqliteDB";

    public PortfolioData(ISqliteDataAccess sqlite)
    {
        _sqlite = sqlite;
    }

    public async Task<List<ProjectDataModel>> GetAllProjectsAsync()
    {
        var results = await _sqlite.LoadData<ProjectModel, dynamic>(@"SELECT * FROM Projects;", new { }, connectionStringName);

        List<ProjectDataModel> output = new();

        foreach (var project in results)
        {
            ProjectDataModel item = new();

            item.Title = project.Title;
            item.SmallImage = project.SmallImage;
            item.SmallImageAlt = project.SmallImageAlt;
            item.BigImages = project.BigImages?.Split(',').ToList();
            item.BigImagesAlt = project.BigImagesAlt?.Split(',').ToList();
            item.ProjectText = project.ProjectText;
            item.ChallengesText = project.ChallengesText;
            item.TechnologiesText = project.TechnologiesText;
            item.TechnologiesList = project.TechnologiesList?.Split(',').ToList();

            output.Add(item);
        }
        return output;
    }

    public Task SaveMessage(string senderName, string senderEmail, string senderMessage)
    {
        return _sqlite.SaveData<dynamic>(
            @"INSERT INTO Messages (SenderName, SenderEmail, SenderMessage) VALUES (@SenderName, @SenderEmail, @SenderMessage);",
            new {SenderName = senderName, SenderEmail = senderEmail, SenderMessage = senderMessage },
            connectionStringName);
    }

    public Task<List<MessageModel>> GetAllMessages()
    {
        var output = _sqlite.LoadData<MessageModel, dynamic>(@"SELECT * FROM Messages;", new { }, connectionStringName);

        return output;
    }
}
