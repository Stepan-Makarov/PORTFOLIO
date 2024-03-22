using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PortfolioLibrary.Models;

public class ProjectModel
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? SmallImage { get; set; }
    public string? SmallImageAlt { get; set; }
    public string? BigImages { get; set; }
    public string? BigImagesAlt { get; set; }
    public string? ProjectText { get; set; }
    public string? ChallengesText { get; set; }
    public string? TechnologiesText { get; set; }
    public string? TechnologiesList { get; set; }
    public string? LinkToGitHub { get; set; }
}