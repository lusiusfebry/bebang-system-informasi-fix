
import os
import re

TARGET_DIR = r"c:\project-it\bebang-information-system-fix\frontend\src\pages\hr\master-data"
SKIP_FILES = ["DivisiList.tsx", "GenericMasterList.tsx"]

def update_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    if "useAuth" in content and "canCreate" in content:
        print(f"Skipping {filepath} (already updated)")
        return

    # 1. Add Imports
    if "import { useAuth } from" not in content:
        import_stmt = "import { useAuth } from '../../../contexts/AuthContext';\nimport { PERMISSIONS } from '../../../constants/permissions';"
        # Insert after last import
        last_import_index = 0
        for match in re.finditer(r"^import .*?;", content, re.MULTILINE):
            last_import_index = match.end()
        
        content = content[:last_import_index] + "\n" + import_stmt + content[last_import_index:]

    # 2. Inject Hook and Permissions
    # Find component body start
    component_regex = r"export const (\w+): React\.FC = \(\) => \{"
    match = re.search(component_regex, content)
    if not match:
        print(f"Could not find component definition in {filepath}")
        return

    component_name = match.group(1)
    insertion_point = match.end()
    
    auth_logic = """
    const { user } = useAuth();

    // Permissions
    const canCreate = user?.roleCode === 'ADMIN' || user?.permissions?.includes(PERMISSIONS.HR_MASTER_CREATE);
    const canUpdate = user?.roleCode === 'ADMIN' || user?.permissions?.includes(PERMISSIONS.HR_MASTER_UPDATE);
    const canDelete = user?.roleCode === 'ADMIN' || user?.permissions?.includes(PERMISSIONS.HR_MASTER_DELETE);
"""
    content = content[:insertion_point] + auth_logic + content[insertion_point:]

    # 3. Wrap Create Button
    # Look for button that calls handleCreate
    # Pattern: <button onClick={handleCreate} ...> ... Tambah ... </button>
    # We use regex to match the whole button tag.
    # Note: Multi-line match.
    
    button_regex = r"(<button\s+onClick=\{handleCreate\}[\s\S]*?>[\s\S]*?Tambah[\s\S]*?<\/button>)"
    
    def wrap_button(m):
        return f"{{canCreate && (\n{m.group(1)}\n                )}}"

    content = re.sub(button_regex, wrap_button, content)

    # 4. Update DataTable props
    # Pattern: onEdit={handleEdit} onDelete={handleDelete}
    # Replace with: onEdit={canUpdate ? handleEdit : undefined} onDelete={canDelete ? handleDelete : undefined}
    
    content = content.replace("onEdit={handleEdit}", "onEdit={canUpdate ? handleEdit : undefined}")
    content = content.replace("onDelete={handleDelete}", "onDelete={canDelete ? handleDelete : undefined}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")

def main():
    for filename in os.listdir(TARGET_DIR):
        if filename.endswith("List.tsx") and filename not in SKIP_FILES:
            filepath = os.path.join(TARGET_DIR, filename)
            update_file(filepath)

if __name__ == "__main__":
    main()
