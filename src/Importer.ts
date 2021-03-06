class Importer {
    /**
     * Erase all existing reports and replace them with records fetched from Upwork
     */
    public static importAndReplaceReports = (): void => {

        Importer.importReplaceTimeReport();
        Importer.importReplaceFinancialReport();

        SpreadsheetApp.getActive().toast("Reports imported");
    }

    public static importReportsSinceLastImport = (): void => {
        const today = new Date();

        const startDate = AdminSheet.instance.getLastImportedDay();
        const endDate = new Date();

        if(DateUtils.format(startDate) === DateUtils.format(endDate)){
            SpreadsheetApp.getActive().toast("You can not import today's records now. Please try again tomorrow");
            return;
        }

        const hasImportedTimeReport = Importer.importTimeReport(startDate, endDate);
        const hasImportedFinancialReport = Importer.importFinancialReport(startDate, endDate);

        AdminSheet.instance.setLastImportedDay(today);
        Importer.logImportBetweenDates(hasImportedTimeReport, hasImportedFinancialReport, startDate, endDate);
    }

    public static importYearlyReports = (): void => {
        const year = AdminSheet.instance.getYearToImport();
        const { startDate, endDate } = DateUtils.getSpanFromYearString(year);
        const hasImportedTimeReport = Importer.importTimeReport(startDate, endDate);
        const hasImportedFinancialReport = Importer.importFinancialReport(startDate, endDate);
        Importer.logImportYear(hasImportedTimeReport, hasImportedFinancialReport, year);
    }

    /**
     * Erase all existing reports and replace them with records fetched from Upwork
     */
    private static importReplaceTimeReport = (): void => {
        const data = TimeReport.get();
        const injectableData = UpworkApiUtils.convertResponseToInjectable(data);
        TimeReportSheet.instance.setReports(injectableData);
    }

    /**
     * Erase all existing reports and replace them with records fetched from Upwork
     */
    private static importReplaceFinancialReport = () => {
        const data = FinancialReport.getFreelancer();
        const injectableData = UpworkApiUtils.convertResponseToInjectable(data);
        FinancialReportSheet.instance.setReports(injectableData);
    }

    /**
     * Import time reports (append to existing reports)
     * @return A boolean indicating if data has been been inserted into the sheet
     */
    private static importTimeReport = (startDate: Date, endDate: Date): boolean => {
        const data = TimeReport.getBetweenDates(startDate, endDate);
        const injectableData = UpworkApiUtils.convertResponseToInjectable(data);
        if(injectableData.length === 0) {
            return false;
        }
        TimeReportSheet.instance.appendEntries(injectableData);
        return true;
    }

    /**
     * Import financial reports (append to existing reports)
     * @return A boolean indicating if data has been been inserted into the sheet
     */
    private static importFinancialReport = (startDate: Date, endDate: Date): boolean => {
        const data = FinancialReport.getFreelancerBetweenDates(startDate, endDate);
        const injectableData = UpworkApiUtils.convertResponseToInjectable(data);
        if(injectableData.length === 0) {
            return false;
        }
        FinancialReportSheet.instance.appendEntries(injectableData);
        return true;
    }


    private static logImportYear = (hasImportedTimeReport: boolean,
                                            hasImportedFinancialReport: boolean,
                                            year: string): void => {
        if(hasImportedTimeReport && hasImportedFinancialReport) {
            SpreadsheetApp.getActive().toast(`Reports imported for year ${year}`);
        }
        else if(hasImportedTimeReport) {
            SpreadsheetApp.getActive().toast(`Time report imported for year ${year}`);
        }
        else if(hasImportedFinancialReport) {
            SpreadsheetApp.getActive().toast(`Financial report imported for year ${year}`);
        }
        else {
            SpreadsheetApp.getActive().toast(`No report available for year ${year}`);
        }
    }

private static logImportBetweenDates = (hasImportedTimeReport: boolean,
                                            hasImportedFinancialReport: boolean,
                                            startDate: Date,
                                            endDate: Date): void => {
        if(hasImportedTimeReport && hasImportedFinancialReport) {
            SpreadsheetApp.getActive().toast(`Reports from ${DateUtils.format(startDate)}`
                + ` to ${DateUtils.format(endDate)} imported `);
        }
        else if(hasImportedTimeReport) {
            SpreadsheetApp.getActive().toast(`Time reports from ${DateUtils.format(startDate)}`
                + ` to ${DateUtils.format(endDate)} imported `);
        }
        else if(hasImportedFinancialReport) {
            SpreadsheetApp.getActive().toast(`Financial reports from ${DateUtils.format(startDate)}`
                + ` to ${DateUtils.format(endDate)} imported `);
        }
        else {
            SpreadsheetApp.getActive().toast(`No report available from ${DateUtils.format(startDate)}`
                + ` to ${DateUtils.format(endDate)} imported `);
        }
    }
}
