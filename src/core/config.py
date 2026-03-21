"""
config.py — Centralized configuration for Project Trinetra.
All hyperparameters, paths, and hardware constraints in one place.
"""

import os
import torch
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# ──────────────────────────────────────────────
#  Paths
# ──────────────────────────────────────────────
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROCESSED_DIR = os.path.join(PROJECT_ROOT, "processed_data")   # output of preprocess.py
RAW_DATA_DIR = r"D:\download\dfdc_train_part_02"
METADATA_CSV  = os.path.join(PROCESSED_DIR, "metadata.csv")
MODEL_DIR     = os.path.join(PROJECT_ROOT, "model")               # best_model.pt lives here
CHECKPOINT_DIR = os.path.join(MODEL_DIR, "checkpoints")           # epoch_*.pt lives here

# ──────────────────────────────────────────────
#  Reality Defender Cloud API
# ──────────────────────────────────────────────
_rd_keys_raw = os.environ.get("RD_API_KEYS", "")
RD_API_KEYS: list[str] = [k.strip() for k in _rd_keys_raw.split(",") if k.strip()]
RD_ENABLED = len(RD_API_KEYS) > 0
RD_TIMEOUT = int(os.environ.get("RD_TIMEOUT", "120"))
RD_RETRY_DELAY = int(os.environ.get("RD_RETRY_DELAY", "2"))
RD_SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac", ".alac"}
RD_MAX_IMAGE_SIZE_MB = 10
RD_MAX_VIDEO_SIZE_MB = 250
RD_MAX_AUDIO_SIZE_MB = 20
RD_MAX_DOC_SIZE_MB = 5

# ──────────────────────────────────────────────
#  Preprocessing
# ──────────────────────────────────────────────
IMG_SIZE = 380                     # EfficientNet-B4 native resolution
SEQ_LEN = 10                      # Frames sampled per video
VIDEO_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp"}
AUDIO_EXTENSIONS = {".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac", ".alac"}

# ──────────────────────────────────────────────
#  Model
# ──────────────────────────────────────────────
EFFICIENTNET_FEATURE_DIM = 1792   # EfficientNet-B4 output features
LSTM_HIDDEN = 512
LSTM_LAYERS = 1
FREEZE_BLOCKS = 5                 # Freeze first N EfficientNet blocks
DROPOUT = 0.3

# ──────────────────────────────────────────────
#  Training  (tuned for RTX 4060 8 GB VRAM)
# ──────────────────────────────────────────────
BATCH_SIZE = 4                    # Real micro-batch size
ACCUM_STEPS = 8                   # Effective batch = BATCH_SIZE * ACCUM_STEPS = 32
EPOCHS = 20
LR = 1e-4
WEIGHT_DECAY = 1e-4
NUM_WORKERS = 4                   # Safe for i7-13650HX (14 cores) + 24 GB RAM on Windows
VAL_SPLIT = 0.2                   # 80/20 train/val
RANDOM_SEED = 42

# ──────────────────────────────────────────────
#  Device
# ──────────────────────────────────────────────
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
