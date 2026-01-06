# Simple HTTP Server with better error handling
param(
    [int]$Port = 8000
)

$ErrorActionPreference = "Stop"

# Function to decode URL
function Decode-Url {
    param([string]$url)
    return [System.Uri]::UnescapeDataString($url)
}

# Function to get MIME type
function Get-MimeType {
    param([string]$filePath)
    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
    $mimeTypes = @{
        ".html" = "text/html; charset=utf-8"
        ".css"  = "text/css"
        ".js"   = "application/javascript"
        ".json" = "application/json"
        ".png"  = "image/png"
        ".jpg"  = "image/jpeg"
        ".jpeg" = "image/jpeg"
        ".svg"  = "image/svg+xml"
    }
    if ($mimeTypes.ContainsKey($ext)) {
        return $mimeTypes[$ext]
    } else {
        return "application/octet-stream"
    }
}

try {
    Write-Host "Starting HTTP Server on port $Port..." -ForegroundColor Cyan
    
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add("http://localhost:$Port/")
    
    try {
        $listener.Start()
        Write-Host "Server started successfully!" -ForegroundColor Green
        Write-Host "Server running at: http://localhost:$Port" -ForegroundColor Green
        Write-Host "Serving from: $PSScriptRoot" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
        Write-Host ""
    } catch {
        Write-Host "ERROR: Could not start server!" -ForegroundColor Red
        Write-Host "Error: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "This usually means:" -ForegroundColor Yellow
        Write-Host "  1. Port $Port is already in use, OR" -ForegroundColor Yellow
        Write-Host "  2. You need administrator privileges" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Try running this script as Administrator" -ForegroundColor Yellow
        Write-Host "Or use a different port (e.g. 8080)" -ForegroundColor Yellow
        pause
        exit 1
    }
    
    $rootPath = $PSScriptRoot
    if ([string]::IsNullOrEmpty($rootPath)) {
        $rootPath = Get-Location
    }
    
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response
            
            # Add CORS headers
            $response.AddHeader("Access-Control-Allow-Origin", "*")
            $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            $response.AddHeader("Access-Control-Allow-Headers", "*")
            
            # Handle OPTIONS requests
            if ($request.HttpMethod -eq "OPTIONS") {
                $response.StatusCode = 200
                $response.Close()
                continue
            }
            
            $localPath = $request.Url.LocalPath
            
            # Default to index.html
            if ($localPath -eq "/") {
                $localPath = "/index.html"
            }
            
            # Decode URL-encoded path - decode each segment separately for better handling
            try {
                $pathSegments = $localPath.TrimStart('/').Split('/')
                $decodedSegments = $pathSegments | ForEach-Object {
                    try {
                        Decode-Url $_
                    } catch {
                        $_
                    }
                }
                $decodedPath = '/' + ($decodedSegments -join '/')
            } catch {
                try {
                    $decodedPath = Decode-Url $localPath
                } catch {
                    $decodedPath = $localPath
                }
            }
            
            # Convert to Windows path
            $relativePath = $decodedPath.TrimStart('/').Replace('/', '\')
            $filePath = Join-Path $rootPath $relativePath
            
            Write-Host "[$($request.HttpMethod)] $localPath" -ForegroundColor Gray
            
            if (Test-Path $filePath -PathType Leaf) {
                try {
                    $content = [System.IO.File]::ReadAllBytes($filePath)
                    $response.ContentLength64 = $content.Length
                    $response.ContentType = Get-MimeType $filePath
                    $response.StatusCode = 200
                    $response.OutputStream.Write($content, 0, $content.Length)
                    Write-Host "  -> 200 OK" -ForegroundColor Green
                } catch {
                    Write-Host "  -> 500 Error: $_" -ForegroundColor Red
                    $response.StatusCode = 500
                    $errorMsg = [System.Text.Encoding]::UTF8.GetBytes("500 Internal Server Error: $_")
                    $response.ContentLength64 = $errorMsg.Length
                    $response.ContentType = "text/plain"
                    $response.OutputStream.Write($errorMsg, 0, $errorMsg.Length)
                }
            } else {
                Write-Host "  -> 404 Not Found" -ForegroundColor Red
                $response.StatusCode = 404
                $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $localPath")
                $response.ContentLength64 = $notFound.Length
                $response.ContentType = "text/plain"
                $response.OutputStream.Write($notFound, 0, $notFound.Length)
            }
            
            $response.Close()
        } catch {
            Write-Host "Request Error: $_" -ForegroundColor Red
            if ($response) {
                try {
                    $response.StatusCode = 500
                    $response.Close()
                } catch {
                    # Ignore
                }
            }
        }
    }
} catch {
    Write-Host "Fatal Error: $_" -ForegroundColor Red
    pause
} finally {
    if ($listener -and $listener.IsListening) {
        $listener.Stop()
        Write-Host "Server stopped." -ForegroundColor Yellow
    }
}


