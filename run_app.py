import uvicorn

if __name__ == "__main__":
    print("========================================================")
    print("Starting ElderHealth Forum 2026 Web Application")
    print("The 6th Thailand National Elderly Health Forum 2026")
    print("========================================================")
    print("Landing Page: http://localhost:8000")
    print("Admin Portal: http://localhost:8000/admin.html")
    print("Admin Credentials: admin / forum2026")
    print("========================================================")
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
