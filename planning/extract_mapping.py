
import pandas as pd
import json

excel_path = 'c:/project-it/bebang-information-system-fix/planning/BMI-kosong.xlsx'

try:
    # Read the mapping sheets
    df_profil = pd.read_excel(excel_path, sheet_name='header excel vs profil karyawan')
    df_master = pd.read_excel(excel_path, sheet_name='header excel vs master data')
    
    # Convert to list of dicts for JSON dump
    profil_data = df_profil.to_dict(orient='records')
    master_data = df_master.to_dict(orient='records')
    
    output = {
        "profil_mapping": profil_data,
        "master_mapping": master_data
    }
    
    print(json.dumps(output, indent=2, default=str))

except Exception as e:
    print(json.dumps({"error": str(e)}))
