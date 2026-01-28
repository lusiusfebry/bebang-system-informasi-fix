# Execution Scripts

Folder ini berisi **Python scripts** yang deterministik untuk menjalankan tugas-tugas.

## Prinsip

1. **Deterministic** - Script harus menghasilkan output yang konsisten untuk input yang sama
2. **Testable** - Mudah diuji secara independen
3. **Fast** - Optimal dan efisien
4. **Reliable** - Menangani error dengan baik

## Tipe Script

- **API calls** - Interaksi dengan external APIs
- **Data processing** - Transformasi dan pemrosesan data
- **File operations** - Operasi file dan direktori
- **Database interactions** - Operasi database

## Environment Variables

Semua environment variables dan API keys disimpan di `.env` pada root direktori.

## Contoh Struktur Script

```python
#!/usr/bin/env python3
"""
Script: nama_script.py
Deskripsi: [Deskripsi singkat]
Usage: python nama_script.py [args]
"""

import os
from dotenv import load_dotenv

load_dotenv()

def main():
    """Main function."""
    # Implementation
    pass

if __name__ == "__main__":
    main()
```

## Self-Annealing

Ketika script error:
1. Baca error message dan stack trace
2. Fix dan test lagi
3. Update directive terkait dengan pembelajaran baru
