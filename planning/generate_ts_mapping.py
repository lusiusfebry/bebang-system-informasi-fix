
import json

with open('import_mapping_clean.json', 'r') as f:
    data = json.load(f)

profil_mapping = data['profil_mapping']
master_mapping = data['master_mapping']

ts_content = """
export interface ExcelMapping {
    excelHeader: string;
    dbField: string | null;
}

export interface MasterMapping {
    excelHeader: string;
    masterField: string;
}

export const PROFILE_MAPPING: ExcelMapping[] = [
"""

for item in profil_mapping:
    header = item.get('Header Excel', '').strip()
    field = item.get('Field Profil Karyawan (### Profil Karyawan)')
    # Handle NaN or null
    if field is None:
        field_val = "null"
    else:
        field_val = f"'{str(field).strip()}'"
    
    ts_content += f"    {{ excelHeader: '{header}', dbField: {field_val} }},\n"

ts_content += "];\n\nexport const MASTER_MAPPING: MasterMapping[] = [\n"

for item in master_mapping:
    header = item.get('Header Excel', '').strip()
    field = item.get('Field Master Data (## 1. Master Data)', '').strip()
    ts_content += f"    {{ excelHeader: '{header}', masterField: '{field}' }},\n"

ts_content += "];\n"

with open('c:/project-it/bebang-information-system-fix/backend/src/config/excel-mapping.ts', 'w') as f:
    f.write(ts_content)

print("TypeScript file generated.")
