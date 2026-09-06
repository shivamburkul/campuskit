# campuskit_export.py
#
# Run this file from anywhere inside the CampusKit project.
# It creates:
#     campuskit_full_source.txt
#
# The TXT contains the complete readable project source with
# file paths separating every file.

from pathlib import Path
import sys

# ------------------------------------------------------------
# Find the CampusKit project directory
# ------------------------------------------------------------

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR

# If the script is placed somewhere else, you can change this
# to the actual CampusKit folder:
#
# PROJECT_ROOT = Path(r"D:\Projects\Earning Projects\campuskit")


# ------------------------------------------------------------
# Output
# ------------------------------------------------------------

OUTPUT_FILE = PROJECT_ROOT / "campuskit_full_source.txt"


# ------------------------------------------------------------
# Folders that should NOT be exported
# ------------------------------------------------------------

EXCLUDED_DIRS = {
    "node_modules",
    ".next",
    ".git",
    ".turbo",
    ".cache",
    "coverage",
    "dist",
    "build",
    "out",
    ".vercel",
}


# ------------------------------------------------------------
# Files that should NOT be exported
# ------------------------------------------------------------

EXCLUDED_FILES = {
    # Environment / secrets
    ".env",
    ".env.local",
    ".env.development",
    ".env.development.local",
    ".env.production",
    ".env.production.local",
    ".env.test",
    ".env.test.local",

    # This generated output file
    "campuskit_full_source.txt",

    # OS junk
    "Thumbs.db",
    ".DS_Store",

    # Editor junk
    ".history",
}


# ------------------------------------------------------------
# File extensions that are normally useful for understanding
# the project.
#
# Unknown text files are also included later when detected as
# UTF-8 text, so important files aren't accidentally skipped.
# ------------------------------------------------------------

TEXT_EXTENSIONS = {
    ".ts",
    ".tsx",
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".json",
    ".css",
    ".scss",
    ".sass",
    ".less",
    ".html",
    ".md",
    ".mdx",
    ".txt",
    ".xml",
    ".svg",
    ".yml",
    ".yaml",
    ".toml",
    ".ini",
    ".config",
    ".conf",
    ".sh",
    ".bash",
    ".ps1",
    ".bat",
    ".cmd",
    ".gitignore",
    ".gitattributes",
    ".editorconfig",
    ".prettierrc",
    ".eslintrc",
}


# ------------------------------------------------------------
# Binary extensions that definitely should NOT be pasted into
# a text file.
# ------------------------------------------------------------

BINARY_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".gif",
    ".webp",
    ".ico",
    ".bmp",
    ".avif",

    ".pdf",

    ".zip",
    ".rar",
    ".7z",
    ".tar",
    ".gz",

    ".mp3",
    ".wav",
    ".ogg",
    ".mp4",
    ".webm",
    ".mov",

    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
    ".eot",

    ".exe",
    ".dll",
    ".so",
    ".dylib",

    ".wasm",
}


# ------------------------------------------------------------
# Check whether a file appears to be text
# ------------------------------------------------------------

def is_text_file(path: Path) -> bool:

    if path.suffix.lower() in BINARY_EXTENSIONS:
        return False

    if path.suffix.lower() in TEXT_EXTENSIONS:
        return True

    # Some important project files have no extension.
    # Try reading a small portion as UTF-8.
    try:
        with path.open("rb") as f:
            sample = f.read(8192)

        if b"\x00" in sample:
            return False

        sample.decode("utf-8")
        return True

    except Exception:
        return False


# ------------------------------------------------------------
# Find project files
# ------------------------------------------------------------

def collect_files():

    files = []

    for path in PROJECT_ROOT.rglob("*"):

        if not path.is_file():
            continue

        relative = path.relative_to(PROJECT_ROOT)

        # Skip excluded directories
        if any(part in EXCLUDED_DIRS for part in relative.parts):
            continue

        # Skip excluded files
        if path.name in EXCLUDED_FILES:
            continue

        # Don't include this script itself
        if path.resolve() == Path(__file__).resolve():
            continue

        # Only include readable text
        if not is_text_file(path):
            continue

        files.append(path)

    return sorted(files, key=lambda p: str(p.relative_to(PROJECT_ROOT)).lower())


# ------------------------------------------------------------
# Write export
# ------------------------------------------------------------

def create_export():

    files = collect_files()

    with OUTPUT_FILE.open(
        "w",
        encoding="utf-8",
        newline="\n"
    ) as output:

        output.write(
            "CAMPUSKIT — COMPLETE PROJECT SOURCE EXPORT\n"
        )

        output.write(
            "============================================================\n\n"
        )

        output.write(
            "This file contains the readable source/configuration/"
            "documentation files of the CampusKit project.\n"
        )

        output.write(
            "Each section begins with its exact relative file path.\n"
        )

        output.write(
            "Generated automatically. Do not treat this file as a "
            "replacement for binary assets.\n\n"
        )

        output.write(
            f"PROJECT ROOT: {PROJECT_ROOT}\n"
        )

        output.write(
            f"FILES INCLUDED: {len(files)}\n\n"
        )

        output.write(
            "============================================================\n"
        )
        output.write(
            "PROJECT FILE INDEX\n"
        )
        output.write(
            "============================================================\n\n"
        )

        for i, path in enumerate(files, start=1):

            relative = path.relative_to(PROJECT_ROOT)

            output.write(
                f"{i:04d}. {relative}\n"
            )

        output.write("\n\n")

        # ----------------------------------------------------
        # Actual file contents
        # ----------------------------------------------------

        for number, path in enumerate(files, start=1):

            relative = path.relative_to(PROJECT_ROOT)

            output.write(
                "\n\n"
                "################################################################\n"
            )

            output.write(
                f"# FILE {number}/{len(files)}\n"
            )

            output.write(
                f"# PATH: {relative}\n"
            )

            output.write(
                "################################################################\n\n"
            )

            try:

                content = path.read_text(
                    encoding="utf-8",
                    errors="strict"
                )

                output.write(content)

                if not content.endswith("\n"):
                    output.write("\n")

            except Exception as error:

                output.write(
                    f"[ERROR READING FILE: {error}]\n"
                )

    print()
    print("=" * 60)
    print("CampusKit project export completed.")
    print("=" * 60)
    print()
    print(f"Files included : {len(files)}")
    print(f"Output file    : {OUTPUT_FILE}")
    print()
    print("Excluded automatically:")
    print("  - node_modules")
    print("  - .next")
    print("  - .git")
    print("  - build/cache folders")
    print("  - .env and environment secrets")
    print("  - binary/media files")
    print()
    print("You can now upload campuskit_full_source.txt to DeepSeek.")
    print()


# ------------------------------------------------------------
# Main
# ------------------------------------------------------------

if __name__ == "__main__":

    try:
        create_export()

    except KeyboardInterrupt:
        print("\nExport cancelled.")

    except Exception as error:
        print("\nERROR:")
        print(error)
        sys.exit(1)