import uuid
from pathlib import Path

from django.conf import settings
from django.core.files.storage import FileSystemStorage


def _get_storage():
    return FileSystemStorage(location=settings.MEDIA_ROOT, base_url=settings.MEDIA_URL)


def upload_file(file_obj, key: str = None, content_type: str = None) -> str:
    fs = _get_storage()
    if key is None:
        ext = Path(file_obj.name).suffix if hasattr(file_obj, "name") else ""
        key = f"{uuid.uuid4().hex}{ext}"
    filename = fs.save(key, file_obj)
    return fs.url(filename)


def get_download_url(key: str, expires_in: int = 3600) -> str:
    fs = _get_storage()
    return fs.url(key)


def delete_file(key: str) -> None:
    fs = _get_storage()
    if fs.exists(key):
        fs.delete(key)
