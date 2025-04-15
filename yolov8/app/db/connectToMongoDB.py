from pymongo import MongoClient

def connect_to_mongo():
    try:
        client = MongoClient("mongodb+srv://lhphucth14:ROKapVZRriM06aJx@cluster0.lxjrdat.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
        print("Kết nối MongoDB thành công!")

        databases = client.list_database_names()
        print("Danh sách cơ sở dữ liệu:", databases)

        return client
    except Exception as e:
        print("Lỗi khi kết nối MongoDB:", e)
        return None

if __name__ == "__main__":
    connect_to_mongo()