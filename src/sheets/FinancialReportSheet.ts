class FinancialReportSheet extends AbstractSheetReport{

    public static instance = new FinancialReportSheet();

    protected SHEET_NAME = "Financial report";
    protected FirstColLetter = "A";
    protected startRow = 2;
}