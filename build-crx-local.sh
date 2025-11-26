#!/data/data/com.termux/files/usr/bin/bash

EXT_DIR="LemurDevToolsPro"
OUT_DIR="dist"
ZIP_NAME="LemurDevToolsPro.zip"
CRX_NAME="LemurDevToolsPro.crx"
PEM_KEY="LemurDevToolsPro.pem"

echo "📦 Building CRX locally on Termux..."

# Check for key
if [ ! -f "$PEM_KEY" ]; then
    echo "❌ ERROR: $PEM_KEY not found."
    echo
