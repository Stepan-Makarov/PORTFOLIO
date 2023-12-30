using PortfolioLibrary.Models;

namespace PortfolioLibrary.DataAccess;

public interface IPortfolioData
{
    Task<List<ProjectDataModel>> GetAllProjectsAsync();
    Task SaveMessage(string senderName, string senderEmail, string senderMessage);
    Task<List<MessageModel>> GetAllMessages();
}