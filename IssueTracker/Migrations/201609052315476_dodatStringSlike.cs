namespace IssueTracker.Migrations
{
    using System.Data.Entity.Migrations;

    public partial class dodatStringSlike : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.AspNetUsers", "Fotografija", c => c.String());
        }

        public override void Down()
        {
            AlterColumn("dbo.AspNetUsers", "Fotografija", c => c.Binary());
        }
    }
}