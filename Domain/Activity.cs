namespace Domain
{
    public class Activity
    {
        public Guid Id { get; set; }
        public string title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public String Category { get; set; }
        public string City { get; set; }
        public string Venue { get; set; }

    }
}