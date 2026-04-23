import torch
import zipfile

def main():
    path = 'dummy.pt'
    torch.save({'a': 1}, path)
    with zipfile.ZipFile(path, 'r') as z:
        print(f"Official torch.save format for {path}:")
        for f in z.namelist()[:10]:
            print(f"  {f}")

if __name__ == "__main__":
    main()
