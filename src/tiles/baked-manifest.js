// Written by tools/tiles/bake-textures.mjs; run it again after changing public/tiles/floor-params.json.
const BAKED = {
  "grad": [
    {
      "file": "grad-b2afe6cc77.png",
      "srgb": true,
      "params": {
        "actGradDir": [
          1,
          0.35
        ],
        "actDarkCol": "#244a92",
        "actLightCol": "#2d5db4",
        "actRim": "#18336c",
        "actUnderCol": "#1d3160",
        "actSheenCol": "#3a6ac0",
        "azim": 48,
        "actBandCol": "#4a7ccc",
        "actUpperAt": 0.25,
        "actUpper": 0.5,
        "actBandAt": 0.05,
        "actBandW": 0.14,
        "actBand": 0.45,
        "actSheenAt": [
          0.18,
          -0.18
        ],
        "actSheenR": 0.2,
        "actSheen": 0.8,
        "actNavyAt": 0.5,
        "actNavyAlong": 0.14,
        "actNavyAcross": 0.22,
        "actUnderDark": 0.9,
        "actHeadGlow": 1,
        "actHeadCol": "#78aaf0",
        "actHeadAt": [
          -0.18,
          -0.15
        ],
        "actHeadR": 0.21,
        "bevel": 0.01,
        "tile": 1,
        "radius": 0.13,
        "actRimBand": 0
      }
    },
    {
      "file": "grad-2a979409a4.png",
      "srgb": true,
      "params": {
        "actGradDir": [
          0.7431,
          0.6691
        ],
        "actDarkCol": "#2f78e0",
        "actLightCol": "#3f8eec",
        "actRim": "#6fb4ff",
        "actUnderCol": "#173f8e",
        "actSheenCol": "#ffffff",
        "azim": 48,
        "actBandCol": "#ffffff",
        "actUpperAt": -0.35,
        "actUpper": 0.8,
        "actBandAt": 0,
        "actBandW": 0.1,
        "actBand": 0,
        "actSheenAt": [
          0,
          0
        ],
        "actSheenR": 0.2,
        "actSheen": 0,
        "actNavyAt": 0.5,
        "actNavyAlong": 0.1,
        "actNavyAcross": 0.2,
        "actUnderDark": 0.9,
        "actHeadGlow": 0,
        "bevel": 0.01,
        "tile": 1,
        "radius": 0.13,
        "actRimBand": 0.02
      }
    }
  ],
  "glint": [
    {
      "file": "glint-54e50497cd.png",
      "srgb": true,
      "params": {
        "glintDroop": 0.1,
        "glintFillCol": "#dcdde2",
        "glintEdgeCol": "#eef6ff",
        "glintRingCol": "#0e2152",
        "glintHaloCol": "#96d4ff",
        "glintCA": null,
        "glintBlur": 20,
        "glintEdgeAt": 0.04,
        "glintEdgeW": 0.025,
        "glintRingW": 0.1,
        "glintRingA": 0.7,
        "glintHaloW": 0.1,
        "glintHaloA": 0,
        "glintWarm": 0.12,
        "glintFill": 0.97,
        "glintEdgeA": 0.5,
        "glintTop": 0.6,
        "glintTopQ": 0.55,
        "glintBottom": 0.52,
        "glintBottomQ": 0.3
      }
    },
    {
      "file": "glint-b50092933a.png",
      "srgb": true,
      "params": {
        "glintDroop": 0.1,
        "glintFillCol": "#eef3fa",
        "glintEdgeCol": "#ffffff",
        "glintRingCol": "#123a86",
        "glintHaloCol": "#96d4ff",
        "glintCA": 1,
        "glintBlur": 20,
        "glintEdgeAt": 0.06,
        "glintEdgeW": 0.035,
        "glintRingW": 0.08,
        "glintRingA": 0.55,
        "glintHaloW": 0.1,
        "glintHaloA": 0.25,
        "glintWarm": 0.1,
        "glintFill": 0.85,
        "glintEdgeA": 0.95,
        "glintTop": 0.6,
        "glintTopQ": 0.55,
        "glintBottom": 0.52,
        "glintBottomQ": 0.3
      }
    }
  ],
  "frost-true": [
    {
      "file": "frost-true-5b6ef5e41f.png",
      "srgb": true,
      "params": {
        "azim": 48,
        "ghostShift": 0.077,
        "bevel": 0.01,
        "ghostWidth": 0.025,
        "frostMottle": 0.05,
        "ghostInset": 0.03,
        "ghostFadeStart": 0.12,
        "ghostFadeEnd": 0.42,
        "ghostDark": 0.04
      }
    }
  ],
  "frost-false": [
    {
      "file": "frost-false-5b6ef5e41f.png",
      "srgb": true,
      "params": {
        "azim": 48,
        "ghostShift": 0.077,
        "bevel": 0.01,
        "ghostWidth": 0.025,
        "frostMottle": 0.05,
        "ghostInset": 0.03,
        "ghostFadeStart": 0.12,
        "ghostFadeEnd": 0.42,
        "ghostDark": 0.04
      }
    }
  ]
};
export default BAKED;
