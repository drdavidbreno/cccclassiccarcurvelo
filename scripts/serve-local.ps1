param(
  [int]$Port = 8080,
  [string]$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
)

$listener = [System.Net.HttpListener]::new()
$prefix = "http://127.0.0.1:$Port/"
$listener.Prefixes.Add($prefix)

$mimeTypes = @{
  ".html" = "text/html; charset=utf-8"
  ".css" = "text/css; charset=utf-8"
  ".js" = "text/javascript; charset=utf-8"
  ".json" = "application/json; charset=utf-8"
  ".png" = "image/png"
  ".jpg" = "image/jpeg"
  ".jpeg" = "image/jpeg"
  ".webp" = "image/webp"
  ".svg" = "image/svg+xml"
  ".mp3" = "audio/mpeg"
  ".webm" = "video/webm"
  ".glb" = "model/gltf-binary"
  ".ttf" = "font/ttf"
}

function Send-TextResponse {
  param(
    [System.Net.HttpListenerResponse]$Response,
    [int]$StatusCode,
    [string]$Text
  )

  $bytes = [System.Text.Encoding]::UTF8.GetBytes($Text)
  $Response.StatusCode = $StatusCode
  $Response.ContentType = "text/plain; charset=utf-8"
  $Response.ContentLength64 = $bytes.Length
  $Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $Response.OutputStream.Close()
}

try {
  $listener.Start()
  Write-Host "Servidor local em $prefix"
  Write-Host "Pasta: $Root"

  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $requestPath = [Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart("/"))

    if ([string]::IsNullOrWhiteSpace($requestPath)) {
      $requestPath = "index.html"
    }

    $relativePath = $requestPath -replace "/", [System.IO.Path]::DirectorySeparatorChar
    $fullPath = [System.IO.Path]::GetFullPath((Join-Path $Root $relativePath))
    $rootPath = [System.IO.Path]::GetFullPath($Root)

    if (-not $fullPath.StartsWith($rootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
      Send-TextResponse $context.Response 403 "Forbidden"
      continue
    }

    if (-not [System.IO.File]::Exists($fullPath)) {
      Send-TextResponse $context.Response 404 "Not found"
      continue
    }

    $extension = [System.IO.Path]::GetExtension($fullPath).ToLowerInvariant()
    $contentType = $mimeTypes[$extension]
    if (-not $contentType) {
      $contentType = "application/octet-stream"
    }

    $bytes = [System.IO.File]::ReadAllBytes($fullPath)
    $context.Response.StatusCode = 200
    $context.Response.ContentType = $contentType
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $context.Response.OutputStream.Close()
  }
}
finally {
  if ($listener.IsListening) {
    $listener.Stop()
  }
  $listener.Close()
}
