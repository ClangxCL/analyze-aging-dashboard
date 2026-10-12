"""
TTM CrossBridge AI - Prototype Runner
Runs a local web server and opens the interactive prototype in default web browser.
"""

import http.server
import socketserver
import webbrowser
import os
import sys

PORT = 8080
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'frontend')

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=FRONTEND_DIR, **kwargs)

def main():
    os.chdir(FRONTEND_DIR)
    url = f"http://localhost:{PORT}"
    print("=" * 60)
    print("  🌿 TTM CrossBridge AI - Interactive Prototype Server")
    print("=" * 60)
    print(f"  Serving directory: {FRONTEND_DIR}")
    print(f"  Opening in browser: {url}")
    print("  Press Ctrl+C to stop the server.")
    print("=" * 60)

    try:
        webbrowser.open(url)
    except Exception as e:
        print(f"  Note: Could not automatically open browser ({e})")

    with socketserver.TCPServer(("", PORT), CustomHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n  Server stopped successfully.")

if __name__ == '__main__':
    main()
