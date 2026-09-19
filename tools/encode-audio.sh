#!/bin/bash
# Make the web delivery file for one master.
#   tools/encode-audio.sh <master> <slug> [audio-stream-index]
# Writes audio/<slug>.v1.m4a (bump VERSION when re-encoding, files are cached as immutable).
# Level: one linear gain toward -14 LUFS, never pushing the true peak past -1 dBTP.
# No compression or limiting, so quiet, dynamic pieces stay quieter than the rest.
# PRE="<ffmpeg audio filter>" runs before measuring (used to close gaps in a mixdown).
set -euo pipefail

master="$1"; slug="$2"; stream="${3:-0}"
version="${VERSION:-1}"
pre="${PRE:-anull}"
out="audio/${slug}.v${version}.m4a"

stats=$(ffmpeg -nostdin -hide_banner -nostats -i "$master" -map "0:a:${stream}" \
  -af "${pre},ebur128=peak=true:framelog=quiet" -f null - 2>&1 | sed -n '/Summary/,$p')
lufs=$(echo "$stats" | awk '/^ +I:/ {print $2; exit}')
peak=$(echo "$stats" | awk '/Peak:/ {print $2; exit}')
gain=$(awk -v i="$lufs" -v p="$peak" 'BEGIN { a = -14 - i; b = -1 - p; printf "%.1f", (a < b ? a : b) }')

encode() {
  ffmpeg -nostdin -v error -y -i "$master" -map "0:a:${stream}" -map_metadata -1 \
    -af "${pre},volume=${gain}dB" -c:a aac_at -b:a 160k \
    -metadata title="${TITLE:-}" -metadata artist="Levant Noir" \
    -movflags +faststart "$out"
}
encode

# AAC can overshoot on sharp transients: if the decoded peak passes -1 dBTP, back the gain off once.
decoded=$(ffmpeg -nostdin -hide_banner -nostats -i "$out" -af ebur128=peak=true:framelog=quiet -f null - 2>&1 | awk '/Peak:/ {print $2; exit}')
over=$(awk -v p="$decoded" 'BEGIN { printf "%.1f", (p > -1 ? p + 1 : 0) }')
if [ "$over" != "0.0" ]; then
  gain=$(awk -v g="$gain" -v o="$over" 'BEGIN { printf "%.1f", g - o }')
  encode
fi

dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$out")
printf '%-44s %6s LUFS  peak %5s  gain %5s dB  %5.0fs  %s\n' "$out" "$lufs" "$peak" "$gain" "$dur" "$(du -h "$out" | cut -f1)"
