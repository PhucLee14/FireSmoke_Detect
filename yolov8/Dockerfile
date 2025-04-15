FROM python:3.9-slim

# Khai báo thư mục tạm thời
ENV TMPDIR=/app/tmp

RUN apt-get update && apt-get install -y \
    libgl1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Tạo thư mục tạm mới
RUN mkdir -p /app/tmp

COPY requirements.txt .

# Tách cài torch/ultralytics nếu muốn
RUN pip install --no-cache-dir torch torchvision ultralytics

# Cài các thư viện còn lại
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--reload"]
