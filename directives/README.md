# Directives

Folder ini berisi **Standard Operating Procedures (SOPs)** dalam format Markdown.

## Struktur Directive

Setiap directive harus mendefinisikan:
- **Goal** - Tujuan dari directive
- **Inputs** - Input yang diperlukan
- **Tools/Scripts** - Script di `execution/` yang akan digunakan
- **Outputs** - Hasil yang diharapkan
- **Edge Cases** - Kasus-kasus khusus yang perlu ditangani

## Contoh Format

```markdown
# [Nama Directive]

## Goal
[Deskripsi tujuan]

## Inputs
- Input 1
- Input 2

## Tools
- `execution/script_name.py`

## Outputs
- Output yang diharapkan

## Edge Cases
- Kasus khusus yang perlu diperhatikan
```

## Prinsip

1. **Directive adalah living documents** - Update saat menemukan constraint baru, pendekatan yang lebih baik, atau error umum
2. **Jangan buat/overwrite tanpa konfirmasi** - Kecuali diminta secara eksplisit
3. **Instruksi seperti untuk karyawan level menengah** - Natural language yang jelas
