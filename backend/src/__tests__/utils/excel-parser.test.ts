import { parseEmployeeExcel } from '../../utils/excel-parser';

describe('Excel Parser', () => {
    it('should exist', () => {
        expect(parseEmployeeExcel).toBeDefined();
    });

    // Detailed testing requires file buffer mocking similar to import service
});
