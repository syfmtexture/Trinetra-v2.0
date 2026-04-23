import zipfile
import sys

def main(path):
    try:
        with zipfile.ZipFile(path, 'r') as z:
            print(f"Contents of {path}:")
            for f in z.namelist()[:10]:
                print(f"  {f}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main(sys.argv[1])
