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
#  Paths: Where everything lives
# ──────────────────────────────────────────────
# We use absolute paths derived from this file's location to avoid 'file not found' 
# errors when running the bot from different directories.
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
PROCESSED_DIR = os.path.join(PROJECT_ROOT, "processed_data")   # Our 'kitchen' where we prep data
RAW_DATA_DIR = r"D:\download\dfdc_train_part_02"              # The raw, messy input data
METADATA_CSV  = os.path.join(PROCESSED_DIR, "metadata.csv")    # The 'index' for all our files
MODEL_DIR     = os.path.join(PROJECT_ROOT, "model")               # The 'brain' storage
CHECKPOINT_DIR = os.path.join(MODEL_DIR, "checkpoints")           # Save points during training

# ──────────────────────────────────────────────
#  Reality Defender Cloud API: Our second opinion
# ──────────────────────────────────────────────
# We support multiple keys to avoid 'out of quota' errors.
_rd_keys_raw = os.environ.get("RD_API_KEYS", "")
RD_API_KEYS: list[str] = [k.strip() for k in _rd_keys_raw.split(",") if k.strip()]
RD_ENABLED = len(RD_API_KEYS) > 0
RD_TIMEOUT = int(os.environ.get("RD_TIMEOUT", "120")) # Give the cloud 2 mins to respond
RD_RETRY_DELAY = int(os.environ.get("RD_RETRY_DELAY", "2"))

# Reality Defender limits (Adjust based on your tier)
RD_MAX_IMAGE_SIZE_MB = 10
RD_MAX_VIDEO_SIZE_MB = 50
RD_MAX_AUDIO_SIZE_MB = 20
RD_MAX_DOC_SIZE_MB = 10

RD_SUPPORTED_EXTENSIONS = {
    ".jpg", ".jpeg", ".png", ".webp",  # Images
    ".mp4", ".mov",                    # Videos
    ".mp3", ".wav", ".m4a", ".aac",    # Audio
    ".pdf", ".docx"                    # Docs
}


# ──────────────────────────────────────────────
#  Gemini AI: The Advanced Forensic Engine
# ──────────────────────────────────────────────
_gemini_keys_raw = os.environ.get("GEMINI_API_KEYS", "")
GEMINI_API_KEYS: list[str] = [k.strip() for k in _gemini_keys_raw.split(",") if k.strip()]
GEMINI_ENABLED = len(GEMINI_API_KEYS) > 0

# ──────────────────────────────────────────────
#  Preprocessing: Making media AI-friendly
# ──────────────────────────────────────────────
IMG_SIZE = 384                     # Sweet spot for EfficientNet-V2-S (high detail, low VRAM)
SEQ_LEN = 20                      # We look at 20 frames per video to spot temporal 'flickering'
VIDEO_EXTENSIONS = {".mp4", ".avi", ".mov", ".mkv"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".bmp"}
AUDIO_EXTENSIONS = {".mp3", ".wav", ".m4a", ".aac", ".ogg", ".flac"}

# ──────────────────────────────────────────────
#  Model Architecture: The Neural Network Specs
# ──────────────────────────────────────────────
EFFICIENTNET_FEATURE_DIM = 1280   # What the 'eyes' of the model see
TRANSFORMER_HEADS = 8             # 'Attention' heads that look for inconsistencies
TRANSFORMER_LAYERS = 4            # Depth of the temporal reasoning
TRANSFORMER_DIM_FF = 2048         # Hidden layers in the transformer
FREEZE_BLOCKS = 5                 # We keep the early 'eyes' frozen to preserve general vision
DROPOUT = 0.3                     # Prevents the model from getting too 'confident' and memorizing data

# ──────────────────────────────────────────────
#  Training: Taming the Beast (Optimized for RTX 4060 8GB)
# ──────────────────────────────────────────────
# We use Gradient Accumulation to simulate a large batch size on limited hardware.
BATCH_SIZE = 4                    # Small actual batch to fit in 8GB VRAM
ACCUM_STEPS = 8                   # We wait 8 steps before updating, effectively batch = 32
EPOCHS = 20
LR = 1e-4                          # Learning rate: not too fast, not too slow
WEIGHT_DECAY = 1e-4
NUM_WORKERS = 4                   # Parallel loading: uses about 4 CPU cores
VAL_SPLIT = 0.2                   # Keep 20% of data for the 'final exam' (validation)
RANDOM_SEED = 42

# ──────────────────────────────────────────────
#  Hardware: CPU vs GPU
# ──────────────────────────────────────────────
# We always prefer CUDA (NVIDIA GPU) for massive speedups.
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
