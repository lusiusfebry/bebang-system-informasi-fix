import { parseExcel } from '../../utils/excel-parser';

describe('Excel Parser', () => {
    it('should exist', () => {
        expect(parseExcel).toBeDefined();
    });

    // Detailed testing requires file buffer mocking similar to import service
});
