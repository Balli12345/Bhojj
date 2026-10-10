#!/usr/bin/env python3
import os
import shutil
import subprocess
import zipfile

print("1. Cleaning old dist and zip files...")
subprocess.run(["rm", "-rf", "dist", "public/bhojj-hostinger-deployment.zip", "bhojj-hostinger-deployment.zip"])

print("2. Running fresh npm run build...")
res = subprocess.run(["npm", "run", "build"], capture_output=True, text=True)
if res.returncode != 0:
    print("Build failed:", res.stderr)
    exit(1)
print("Build succeeded!")

dist_dir = os.path.abspath("dist")
public_zip = os.path.abspath("public/bhojj-hostinger-deployment.zip")
dist_zip = os.path.abspath("dist/bhojj-hostinger-deployment.zip")
root_zip = os.path.abspath("bhojj-hostinger-deployment.zip")

# Ensure .htaccess exists in dist
htaccess_src = os.path.abspath("public/.htaccess")
htaccess_dst = os.path.join(dist_dir, ".htaccess")
if os.path.exists(htaccess_src) and not os.path.exists(htaccess_dst):
    shutil.copyfile(htaccess_src, htaccess_dst)
    print("Copied .htaccess into dist/")

# Add Hostinger Readme instructions directly in dist
readme_path = os.path.join(dist_dir, "HOSTINGER-DEPLOY-INSTRUCTIONS.txt")
with open(readme_path, "w", encoding="utf-8") as f:
    f.write("""======================================================================
  BHOJJ SATVIK FOOD PLATFORM - HOSTINGER INSTALLATION GUIDE
======================================================================

CRITICAL STEP FOR HOSTINGER:
1. Log in to Hostinger hPanel -> Go to File Manager.
2. Navigate to: public_html
3. *** IMPORTANT ***: Delete any old 'index.php', 'setup.php', or 'default.php'
   files currently in public_html! If old PHP files remain, Hostinger will
   continue displaying 'Database setup pending' instead of your modern web app.
4. Upload all the contents of this zip directly into: public_html
   (Or upload the ZIP file and click 'Extract Here').
5. Verify that 'index.html' and '.htaccess' are directly in public_html:
   - public_html/index.html
   - public_html/.htaccess
   - public_html/assets/
6. Open your site (e.g. https://bhojj.site.je) and test!
   All portals (Customer, Kitchen, Fleet Partner, Super Admin CMS) work
   100% out of the box with zero database or server setup required!
======================================================================
""")

print(f"3. Packaging {dist_dir} into zip files...")

def create_zip(target_path):
    with zipfile.ZipFile(target_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(dist_dir):
            for file in files:
                # Skip any zip files to avoid recursion
                if file.endswith('.zip'):
                    continue
                file_path = os.path.join(root, file)
                rel_path = os.path.relpath(file_path, dist_dir)
                zipf.write(file_path, rel_path)
    print(f"Created {target_path} ({os.path.getsize(target_path) / 1024:.1f} KB)")

# Create root zip
create_zip(root_zip)

# Also create in public so Vite dev server can serve it
create_zip(public_zip)

# Also copy into dist so it's downloadable from production dist
shutil.copyfile(root_zip, dist_zip)
print(f"Copied zip to {dist_zip}")

print("Packaging for Hostinger complete!")

