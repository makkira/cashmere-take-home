from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from PIL import Image
from PIL import ExifTags
import ffmpeg
import sys
from pprint import pprint 
import subprocess
from datetime import datetime, timezone
from typing import List
import os
import shutil
import uuid
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

portfolio_db = {}  # Simulated in-memory DB

class TechnicalMetadata(BaseModel):
    resolution: str | None = None
    aspect_ratio: str | None = None
    duration: str | None = None
    quality: str | None = None
    creation_time: str | None = None

class MediaItem(BaseModel):
    id: str
    filename: str
    media_type: str  # "image" or "video"
    title: str
    description: str
    category: str
    technical_metadata: TechnicalMetadata | None = None
    upload_date: str

class Portfolio(BaseModel):
    user_id: str
    items: List[MediaItem]

def get_file_metadata(file_path: str, file_type: str):
    upload_date = datetime.now(timezone.utc).isoformat()
    technical_metadata = {}
    if file_type.startswith("image/"):
        technical_metadata = get_image_metadata(file_path)
    else:
        technical_metadata = get_video_metadata(file_path)
    
    return {
        "upload_date": upload_date,
        "technical_metadata": technical_metadata
    }   

def get_image_metadata(file_path: str):
    try:
        image = Image.open(file_path)
        resolution = f"{image.width}x{image.height}"
        exif_data = image.getexif()
        creation_time = None

        if exif_data is not None:
            for tag_id, value in exif_data.items():
                tag = ExifTags.TAGS.get(tag_id, tag_id)
                if tag == "DateTime" or tag == "DateTimeOriginal":
                    creation_time = value
                    break
        if creation_time:
            creation_time = datetime.strptime(creation_time, "%Y:%m:%d %H:%M:%S").isoformat()
        else:
            creation_time = datetime.fromtimestamp(os.stat(file_path).st_mtime, tz=timezone.utc).isoformat()

        return {
            "resolution": resolution,
            "type": image.format,
            "creation_time": creation_time,
        }
    except Exception as e:
        print(f"Error reading image metadata: {e}")
        return {}

def get_video_metadata(file_path: str):
    try:
        probe = ffmpeg.probe(file_path)
        video_stream = next((s for s in probe["streams"] if s["codec_type"] == "video"), None)

        if not video_stream:
            print("❌ No video stream found.")
            return {}

        width = int(video_stream.get("width", 0))
        height = int(video_stream.get("height", 0))
        resolution = f"{width}x{height}"

        # Get common quality label
        quality_map = {
            2160: "4K",
            1440: "1440p",
            1080: "1080p",
            720: "720p",
            480: "480p",
            360: "360p",
            240: "240p",
        }
        quality = quality_map.get(height, f"{height}p")

        # Aspect ratio as simplified string
        from math import gcd
        common_divisor = gcd(width, height)
        aspect_ratio = f"{width // common_divisor}:{height // common_divisor}"

        # Duration
        duration_sec = float(probe["format"].get("duration", 0))
        hours = int(duration_sec // 3600)
        minutes = int((duration_sec % 3600) // 60)
        seconds = int(duration_sec % 60)
        duration_human = f"{hours:02}:{minutes:02}:{seconds:02}"

        if 'format' in probe and 'tags' in probe['format'] and 'creation_time' in probe['format']['tags']:
            creation_time = probe['format']['tags']['creation_time']
        elif 'streams' in probe:
            for stream in probe['streams']:
                if 'tags' in stream and 'creation_time' in stream['tags']:
                    creation_time = stream['tags']['creation_time']
        else:
            creation_time = datetime.fromtimestamp(os.stat(file_path).st_mtime, tz=timezone.utc).isoformat()

        return {
            "creation_time": creation_time,
            "resolution": resolution,
            "aspect_ratio": aspect_ratio,
            "quality": quality,
            "duration": duration_human
        }

    except Exception as e:
        print(f"rror reading video metadata: {e}")
        return {}


@app.post("/upload")
async def upload_file(
    file: UploadFile = File(...), 
    title: str = Form(...), 
    description: str = Form(...), 
    category: str = Form(...)
    ):
    
    file_id = str(uuid.uuid4())
    original_filename = file.filename
    file_type = os.path.splitext(file.filename)[1]
    file_name = f"{file_id}{file_type}"
    file_path = os.path.join(UPLOAD_DIR, file_name)

    # Save to disk
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    if not (file.content_type.startswith("image/") or file.content_type.startswith("video/")):
        return JSONResponse(status_code=400, content={"error": "Invalid file type"})

    file_metadata = get_file_metadata(file_path,file.content_type )

    return JSONResponse({
        "id": file_id,
        "filename": file_name,
        "file_path": f"/uploads/{file_name}",
        "original_filename": original_filename,
        "media_type": file.content_type,
        "title": title,
        "description": description,
        "category": category,
        "technical_metadata": file_metadata.get("technical_metadata", {}),
        "upload_date": file_metadata.get("upload_date"),
    })

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.post("/save-portfolio")
async def save_portfolio(portfolio: Portfolio):
    # TODO - Remove print
    print(f"✅ Portfolio DB before save: {portfolio_db}")
    portfolio_db[portfolio.user_id] = portfolio.items
    print(f"✅ Portfolio DB after save: {portfolio_db}")

    return {"message": "Portfolio saved successfully"}

@app.get("/load-portfolio/{user_id}")
async def load_portfolio(user_id: str):
    return {"items": portfolio_db.get(user_id, [])}
