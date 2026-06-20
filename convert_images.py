import os
import re
from PIL import Image
import sys

def process_blog(blog_filepath, public_dir):
    print(f"Processing {blog_filepath}")
    with open(blog_filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    blog_name = os.path.splitext(os.path.basename(blog_filepath))[0]
    replacements = {}

    def add_replacement(src, is_main=False):
        if src.startswith('/images/blog/') and not src.endswith('.webp'):
            if src not in replacements:
                suffix = "main" if is_main else str(len(replacements) + 1)
                new_src = f"/images/blog/{blog_name}-{suffix}.webp"
                replacements[src] = new_src

    # Find Frontmatter image first so it gets the "-main" suffix
    for match in re.finditer(r'image:\s*"([^"]+)"', content):
        add_replacement(match.group(1), is_main=True)

    # Find HTML images
    for match in re.finditer(r'<img\s+[^>]*src="([^"]+)"', content):
        add_replacement(match.group(1))

    # Find Markdown images
    for match in re.finditer(r'!\[.*?\]\(([^)]+)\)', content):
        add_replacement(match.group(1))

    for old_src, new_src in replacements.items():
        old_file = os.path.normpath(os.path.join(public_dir, old_src.lstrip('/')))
        new_file = os.path.normpath(os.path.join(public_dir, new_src.lstrip('/')))
        
        if os.path.exists(old_file):
            print(f"Converting {old_src} -> {new_src}")
            img = Image.open(old_file)
            img.save(new_file, 'webp')
            content = content.replace(old_src, new_src)
            # Remove old file to clean up space
            os.remove(old_file)
        else:
            print(f"File not found: {old_file}")

    with open(blog_filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        blog_path = sys.argv[1]
    else:
        blog_path = r"d:\Startup\src\content\blog\child-s-uk-passport.md"
        
    public_dir = r"d:\Startup\public"
    process_blog(blog_path, public_dir)
