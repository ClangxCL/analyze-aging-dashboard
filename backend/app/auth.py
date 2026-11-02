import time
import json
import hmac
import hashlib
import base64
from .config import settings

def b64url_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode('utf-8').rstrip('=')

def b64url_decode(data: str) -> bytes:
    pad = 4 - (len(data) % 4)
    if pad != 4:
        data += '=' * pad
    return base64.urlsafe_b64decode(data.encode('utf-8'))

def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = int(time.time()) + (settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60)
    to_encode.update({"exp": expire})
    
    header = {"alg": "HS256", "typ": "JWT"}
    header_b64 = b64url_encode(json.dumps(header).encode('utf-8'))
    payload_b64 = b64url_encode(json.dumps(to_encode, ensure_ascii=False).encode('utf-8'))
    
    msg = f"{header_b64}.{payload_b64}".encode('utf-8')
    sig = hmac.new(settings.JWT_SECRET.encode('utf-8'), msg, hashlib.sha256).digest()
    sig_b64 = b64url_encode(sig)
    
    return f"{header_b64}.{payload_b64}.{sig_b64}"

def verify_access_token(token: str) -> dict:
    parts = token.split('.')
    if len(parts) != 3:
        raise ValueError("Invalid JWT token format")
    header_b64, payload_b64, sig_b64 = parts
    
    msg = f"{header_b64}.{payload_b64}".encode('utf-8')
    expected_sig = hmac.new(settings.JWT_SECRET.encode('utf-8'), msg, hashlib.sha256).digest()
    if not hmac.compare_digest(b64url_encode(expected_sig), sig_b64):
        raise ValueError("Token signature verification failed")
        
    payload = json.loads(b64url_decode(payload_b64).decode('utf-8'))
    if "exp" in payload and payload["exp"] < time.time():
        raise ValueError("Token has expired")
        
    return payload
