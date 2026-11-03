import os
import shutil
import subprocess
from pathlib import Path

src_dir = Path(r"C:\Users\Piyanut\Desktop\Code_Work")
dest_dir = Path(r"C:\Users\Piyanut\Desktop\elderhealth-forum-2026")

if dest_dir.exists():
    shutil.rmtree(dest_dir)

dest_dir.mkdir(parents=True, exist_ok=True)

# List of folders to copy
folders_to_copy = [
    "backend",
    "frontend",
    "tests",
    "scripts",
    "docs",
]

# List of specific files to copy
files_to_copy = [
    ".gitignore",
    "README.md",
    "PRODUCT.md",
    "DESIGN.md",
    "Forum_6.docx",
    "requirements.txt",
    "run_app.py",
    "start_server.bat",
    "vercel.json",
]

# Ignore patterns for copying
def ignore_patterns(path, names):
    ignored = set()
    for name in names:
        if name in [".venv", "venv", "__pycache__", ".pytest_cache", ".agents", ".codex", ".impeccable"]:
            ignored.add(name)
        elif name.endswith((".pyc", ".pyo", ".log", ".tmp")):
            ignored.add(name)
    return ignored

print("Copying directories...")
for folder in folders_to_copy:
    s = src_dir / folder
    d = dest_dir / folder
    if s.exists():
        shutil.copytree(s, d, ignore=ignore_patterns)
        print(f"  Copied {folder}")

print("Copying files...")
for file in files_to_copy:
    s = src_dir / file
    d = dest_dir / file
    if s.exists():
        shutil.copy2(s, d)
        print(f"  Copied {file}")

# Initialize a clean git repository in the destination folder
print("Initializing clean git repository in destination folder...")
try:
    subprocess.run(["git", "init", "-b", "main"], cwd=str(dest_dir), check=True)
    subprocess.run(["git", "add", "."], cwd=str(dest_dir), check=True)
    subprocess.run(["git", "commit", "-m", "feat: ElderHealth Forum 2026 - National Elderly Health Forum 6"], cwd=str(dest_dir), check=True)
    subprocess.run(["git", "remote", "add", "origin", "https://github.com/AgingDMSinfo/elderhealth-forum-2026.git"], cwd=str(dest_dir), check=True)
    print("  Git repo initialized successfully with remote origin.")
except Exception as e:
    print(f"  Git init error: {e}")

# Create ZIP archive on Desktop
zip_path = Path(r"C:\Users\Piyanut\Desktop\elderhealth-forum-2026")
print("Creating ZIP archive...")
shutil.make_archive(str(zip_path), 'zip', root_dir=str(dest_dir))
print(f"  Created ZIP at {zip_path}.zip")

print("Done! Dedicated project folder and ZIP are ready.")
