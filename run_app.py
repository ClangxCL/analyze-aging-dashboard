import uvicorn

if __name__ == "__main__":
    print("===================================================================")
    print("Analyze Aging: ระบบสารสนเทศและแดชบอร์ดสุขภาพผู้สูงอายุไทย (MOPH HDC)")
    print("Closed-Loop Data Engineering & 9-Domain Epidemiological Surveillance")
    print("===================================================================")
    print("Interactive Dashboard: http://localhost:8000")
    print("Swagger API Docs:      http://localhost:8000/docs")
    print("===================================================================")
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
