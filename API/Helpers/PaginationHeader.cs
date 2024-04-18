namespace API.Helpers
{
    public class PaginationHeader
    {
        public PaginationHeader(int currentPage, int pageSize, int totalPages, int totalCount)
        {
            CurrentPage = currentPage;
            PageSize = pageSize;
            TotalPages = totalPages;
            TotalCount = totalCount;
        }

        public int CurrentPage { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public int TotalCount { get; set; }
    }
}