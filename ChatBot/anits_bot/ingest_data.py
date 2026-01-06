import os
from brain import AnitsBrain

def main():
    brain = AnitsBrain()
    data_folder = "./college_data"
    
    # Safety check: does the folder exist?
    if not os.path.exists(data_folder):
        print(f"Error: {data_folder} not found!")
        return

    # Loop through every file Member 3 gave you
    for filename in os.listdir(data_folder):
        if filename.endswith(".txt"):
            file_path = os.path.join(data_folder, filename)
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
                print(f"Processing: {filename}...")
                # This sends the data to your ChromaDB
                result = brain.ingest_text(content, filename)
                print(result)

    print("\n✅ All data has been added to the brain!")

if __name__ == "__main__":
    main()