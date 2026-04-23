import zipfile
import os

def main():
    src = r'a:\KODES\Trinetra-18-3\Trinetra\best_model'
    target = r'a:\KODES\Trinetra-18-3\Trinetra\backend\model\best_model.pt'
    
    # PyTorch expects a root directory inside the zip.
    # Usually it's 'archive' or the filename. 'archive' is the modern standard.
    root_name = 'archive'
    
    print(f"Zipping {src} into {target} with root {root_name}...")
    
    with zipfile.ZipFile(target, 'w', compression=zipfile.ZIP_STORED) as z:
        for root, dirs, files in os.walk(src):
            for file in files:
                abspath = os.path.join(root, file)
                relpath = os.path.relpath(abspath, src)
                arcname = os.path.join(root_name, relpath)
                z.write(abspath, arcname)
    
    print("Done.")

if __name__ == "__main__":
    main()
