#!/bin/bash
# Web delivery files for the three scored films (picture + levelled score) and their posters.
# White Rose: the film's own soundtrack is dropped and the alternative-ending score laid under the picture.
# Gains match the ones tools/encode-audio.sh settled on for the same masters.
set -euo pipefail
X=(-c:v libx264 -preset slow -pix_fmt yuv420p -profile:v high -movflags +faststart -map_metadata -1 -c:a aac_at -b:a 160k)

ffmpeg -nostdin -v error -y -i masters/L4-WhiteRose-ioannis.mp4 -i masters/L4-WhiteRose-alt-end-ioannis.wav \
  -map 0:v:0 -map 1:a:0 -af volume=-2.1dB -crf 26 "${X[@]}" video/white-rose.v1.mp4
ffmpeg -nostdin -v error -y -i "masters/L3 - the-boxer-30s-ioannis.mov" \
  -map 0:v:0 -map 0:a:1 -vf scale=1280:-2 -af volume=1.1dB -crf 24 "${X[@]}" video/the-boxer.v1.mp4
ffmpeg -nostdin -v error -y -i masters/L3-Waves-Short.mov \
  -map 0:v:0 -map 0:a:1 -vf crop=1280:532:0:94 -af volume=13.1dB -crf 24 "${X[@]}" video/waves.v1.mp4

ffmpeg -nostdin -v error -y -ss 132 -i masters/L4-WhiteRose-ioannis.mp4 -frames:v 1 -q:v 4 video/white-rose.v1.jpg
ffmpeg -nostdin -v error -y -ss 9 -i "masters/L3 - the-boxer-30s-ioannis.mov" -frames:v 1 -vf scale=1280:-2 -q:v 4 video/the-boxer.v1.jpg
ffmpeg -nostdin -v error -y -ss 28 -i masters/L3-Waves-Short.mov -frames:v 1 -vf crop=1280:532:0:94 -q:v 4 video/waves.v1.jpg
