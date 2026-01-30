
try:
    import pandas
    import openpyxl
    print("DEPENDENCIES_AVAILABLE")
except ImportError as e:
    print(f"DEPENDENCIES_MISSING: {e}")
