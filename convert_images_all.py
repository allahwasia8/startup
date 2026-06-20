import os
import re
from PIL import Image
import sys
import glob

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
            try:
                os.remove(old_file)
            except Exception as e:
                print(f"Error removing {old_file}: {e}")
        else:
            # Maybe already converted or missing
            # If the image was missing, let's not replace it in content to avoid broken webp paths for nothing
            pass

    with open(blog_filepath, 'w', encoding='utf-8') as f:
        f.write(content)

if __name__ == "__main__":
    blog_dir = r"d:\Startup\src\content\blog"
    public_dir = r"d:\Startup\public"
    
    md_files = glob.glob(os.path.join(blog_dir, "*.md"))
    print(f"Found {len(md_files)} blog posts. Converting images...")
    
    for md_file in md_files:
        process_blog(md_file, public_dir)
        
    print("Done converting all images!")
