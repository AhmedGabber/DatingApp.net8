using System;

namespace API.Helpers;

public class PaginationHeader(int currentPage, int itemPerPage, int totalItem, int totalPages)
{
  public int CurrentPage { get; set; }=currentPage;
  public int ItemPerPage { get; set; }=itemPerPage;
  public int TotalItem { get; set; }=totalItem;
  public int TotalPages { get; set; }=totalPages;
}
