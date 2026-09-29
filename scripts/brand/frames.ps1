param([string]$R = (Join-Path $PSScriptRoot "render"))   # pasta com frame.html (gerada por gen.js)
$edge = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
$frames = Join-Path $R "frames"
New-Item -ItemType Directory -Force -Path $frames | Out-Null
$page = "file:///" + ($R -replace '\\','/') + "/frame.html"
$total = 173          # 0..172 a 30 fps = 5,73 s (intro + 2 ciclos completos de pulso)
$workers = 4
$running = @()
for ($i = 0; $i -lt $total; $i++) {
  $out = Join-Path $frames ("f{0:D4}.png" -f $i)
  if (Test-Path $out) { continue }
  $t = [math]::Round($i * 1000 / 30)
  $ud = "$R\ud_w" + ($i % $workers)
  $argList = @("--headless=new","--disable-gpu","--hide-scrollbars","--force-device-scale-factor=1","--user-data-dir=$ud","--window-size=3840,2160","--screenshot=$out","$page`?t=$t")
  $running += Start-Process -FilePath $edge -ArgumentList $argList -PassThru -NoNewWindow -RedirectStandardError "$R\e$($i % $workers).txt" -RedirectStandardOutput "$R\o$($i % $workers).txt"
  while (($running | Where-Object { -not $_.HasExited }).Count -ge $workers) { Start-Sleep -Milliseconds 150 }
}
$running | ForEach-Object { $_.WaitForExit() }
"FRAMES_OK: " + (Get-ChildItem $frames -Filter *.png).Count
