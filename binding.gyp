{
  "targets": [
    {
      "target_name": "<(module_name)",
      "include_dirs": ["lib/unqlite", "<!(node -e \"require('nan')\")"],
      "cflags": ["-fexceptions"],
      "cflags_cc": ["-fexceptions"],
      "cflags!": ["-fno-exceptions"],
      "cflags_cc!": ["-fno-exception"],
      "conditions": [
        ['OS=="mac"', {
            "xcode_settings": {
              "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
              "GCC_ENABLE_CPP_RTTI": "YES"
            }
          }
        ],
      ],
    },
    {
    "target_name": "action_after_build",
    "type": "none",
    "dependencies": [ "<(module_name)" ],
    "copies": [
        {
            "files": [ "<(PRODUCT_DIR)/<(module_name).node" ],
            "destination": "<(module_path)"
        }
      ]
    }
  ]
}
