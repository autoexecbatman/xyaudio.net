#!/usr/bin/env python3
"""
Production-ready HTTP server for xyaudio.net
Includes gzip compression, security headers, and proper MIME types
"""

import http.server
import socketserver
import os
import sys
import gzip
import mimetypes
from pathlib import Path
from urllib.parse import unquote

PORT = 8080
DIRECTORY = Path(__file__).parent

class ProductionHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        
        # Cache control
        if self.path.endswith(('.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico')):
            self.send_header('Cache-Control', 'public, max-age=86400')  # 24 hours
        else:
            self.send_header('Cache-Control', 'no-cache')
        
        super().end_headers()
    
    def do_GET(self):
        """Handle GET requests with gzip compression"""
        path = self.translate_path(self.path)
        
        if os.path.isfile(path):
            # Check if client accepts gzip
            accept_encoding = self.headers.get('Accept-Encoding', '')
            
            if 'gzip' in accept_encoding and self.should_compress(path):
                self.send_compressed_file(path)
            else:
                super().do_GET()
        else:
            super().do_GET()
    
    def should_compress(self, path):
        """Determine if file should be compressed"""
        compress_types = {'.html', '.css', '.js', '.json', '.xml', '.txt'}
        return Path(path).suffix.lower() in compress_types
    
    def send_compressed_file(self, path):
        """Send file with gzip compression"""
        try:
            with open(path, 'rb') as f:
                content = f.read()
            
            compressed = gzip.compress(content)
            
            self.send_response(200)
            self.send_header('Content-Type', mimetypes.guess_type(path)[0] or 'application/octet-stream')
            self.send_header('Content-Encoding', 'gzip')
            self.send_header('Content-Length', str(len(compressed)))
            self.end_headers()
            self.wfile.write(compressed)
            
        except Exception as e:
            self.send_error(500, f"Internal server error: {e}")

def main():
    """Start the production server"""
    os.chdir(DIRECTORY)
    
    with socketserver.TCPServer(("", PORT), ProductionHTTPRequestHandler) as httpd:
        print(f"Production server for xyaudio.net at http://localhost:{PORT}")
        print(f"Directory: {DIRECTORY}")
        print("Features: gzip compression, security headers, caching")
        print("Press Ctrl+C to stop")
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped")
            sys.exit(0)

if __name__ == "__main__":
    main()
