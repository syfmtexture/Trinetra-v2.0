"""
model.py — Hybrid EfficientNet-B4 + LSTM Deepfake Detector for Project Trinetra.

Architecture
────────────
1. Spatial backbone : EfficientNet-B4 (ImageNet pre-trained, lower blocks frozen)
   → produces a 1792-d feature vector per frame.
2. Temporal head    : LSTM that consumes the per-frame feature sequence.
3. Adaptive routing : If the input has T == 1 (static image), the LSTM is
   bypassed and the spatial features go straight to the classification head.
"""

import torch
import torch.nn as nn
from torchvision import models

from src.core.config import (
    DROPOUT,
    EFFICIENTNET_FEATURE_DIM,
    FREEZE_BLOCKS,
    LSTM_HIDDEN,
    LSTM_LAYERS,
)


class DeepfakeDetector(nn.Module):
    """
    Forward signature
    -----------------
    x : Tensor of shape (B, T, C, H, W)
        • T = SEQ_LEN for video sequences
        • T = 1       for static images

    Returns
    -------
    logits : Tensor of shape (B, 1)
        Raw logit (apply sigmoid for probability).
    """

    def __init__(self):
        super().__init__()

        # ── 1. Spatial feature extractor (EfficientNet-B4) ──
        backbone = models.efficientnet_b4(weights=models.EfficientNet_B4_Weights.IMAGENET1K_V1)

        # Remove the original classifier head
        self.features = backbone.features         # Sequential of blocks
        self.pool = backbone.avgpool              # AdaptiveAvgPool2d
        feature_dim = EFFICIENTNET_FEATURE_DIM    # 1792

        # Freeze the lower blocks
        for i, block in enumerate(self.features):
            if i < FREEZE_BLOCKS:
                for param in block.parameters():
                    param.requires_grad = False

        # ── 2. Temporal sequence analyzer (LSTM) ──
        self.lstm = nn.LSTM(
            input_size=feature_dim,
            hidden_size=LSTM_HIDDEN,
            num_layers=LSTM_LAYERS,
            batch_first=True,
            dropout=0.0 if LSTM_LAYERS == 1 else DROPOUT,
        )

        # ── 3. Classification heads ──
        #   One for sequence path (after LSTM), one for static path (direct)
        self.dropout = nn.Dropout(DROPOUT)

        self.fc_seq = nn.Linear(LSTM_HIDDEN, 1)
        self.fc_static = nn.Linear(feature_dim, 1)

    # ──────────────────────────────────────────

    def _extract_spatial(self, x: torch.Tensor) -> torch.Tensor:
        """
        x : (N, C, H, W)  →  (N, feature_dim)
        Passes through EfficientNet feature blocks + global avg pool.
        """
        x = self.features(x)
        x = self.pool(x)
        x = torch.flatten(x, 1)
        return x

    # ──────────────────────────────────────────

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        """
        x : (B, T, C, H, W)

        Adaptive routing:
          • T > 1  → spatial features → LSTM → fc_seq
          • T == 1 → spatial features →        fc_static
        """
        B, T, C, H, W = x.shape

        # Flatten batch and time for the CNN: (B*T, C, H, W)
        x_flat = x.reshape(B * T, C, H, W)
        features = self._extract_spatial(x_flat)    # (B*T, feat_dim)

        if T > 1:
            # ── Sequence path ──
            features = features.reshape(B, T, -1)   # (B, T, feat_dim)
            lstm_out, _ = self.lstm(features)        # (B, T, hidden)
            last_hidden = lstm_out[:, -1, :]         # (B, hidden)
            logits = self.fc_seq(self.dropout(last_hidden))  # (B, 1)
        else:
            # ── Static image path (bypass LSTM) ──
            features = features.reshape(B, -1)       # (B, feat_dim)
            logits = self.fc_static(self.dropout(features))  # (B, 1)

        return logits

    # ──────────────────────────────────────────

    def forward_with_hidden(self, x: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor | None]:
        """
        Same as forward() but additionally returns LSTM hidden states
        for XAI temporal analysis.

        Returns
        -------
        logits      : (B, 1)
        lstm_states : (B, T, hidden) or None (if T == 1)
        """
        B, T, C, H, W = x.shape

        x_flat = x.reshape(B * T, C, H, W)
        features = self._extract_spatial(x_flat)

        if T > 1:
            features = features.reshape(B, T, -1)
            lstm_out, _ = self.lstm(features)
            last_hidden = lstm_out[:, -1, :]
            logits = self.fc_seq(self.dropout(last_hidden))
            return logits, lstm_out
        else:
            features = features.reshape(B, -1)
            logits = self.fc_static(self.dropout(features))
            return logits, None


# ──────────────────────────────────────────────
#  Quick sanity check
# ──────────────────────────────────────────────

if __name__ == "__main__":
    from config import DEVICE, IMG_SIZE, SEQ_LEN

    model = DeepfakeDetector().to(DEVICE)

    # Count parameters
    total = sum(p.numel() for p in model.parameters())
    trainable = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"Total params:     {total:,}")
    print(f"Trainable params: {trainable:,}")

    # Sequence smoke test
    dummy_seq = torch.randn(2, SEQ_LEN, 3, IMG_SIZE, IMG_SIZE, device=DEVICE)
    out_seq = model(dummy_seq)
    print(f"Sequence  input: {dummy_seq.shape} → output: {out_seq.shape}")

    # Static smoke test
    dummy_static = torch.randn(2, 1, 3, IMG_SIZE, IMG_SIZE, device=DEVICE)
    out_static = model(dummy_static)
    print(f"Static    input: {dummy_static.shape} → output: {out_static.shape}")

    print("✓ Model forward pass OK for both sequence and static inputs.")
