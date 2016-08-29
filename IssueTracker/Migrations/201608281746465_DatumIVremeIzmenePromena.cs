namespace IssueTracker.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class DatumIVremeIzmenePromena : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.IstorijaProblemas", "VremeAkcije", c => c.DateTime(nullable: false));
            AddColumn("dbo.Problems", "VremePoslednjeIzmene", c => c.DateTime());
            DropColumn("dbo.IstorijaProblemas", "DatumIzmene");
            DropColumn("dbo.Problems", "DatumIzmene");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Problems", "DatumIzmene", c => c.DateTime());
            AddColumn("dbo.IstorijaProblemas", "DatumIzmene", c => c.DateTime(nullable: false));
            DropColumn("dbo.Problems", "VremePoslednjeIzmene");
            DropColumn("dbo.IstorijaProblemas", "VremeAkcije");
        }
    }
}
