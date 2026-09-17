---
name: armapc-usb-jorge-rules
description: >-
  Strictly enforces the data flow and storage rules for the ArmaPC project. Validates the "JORGE" USB drive connection dynamically by volume label before any raw data download, and halts execution if missing. Protects original backup files.
---

# ArmaPC USB "JORGE" Rules

## Overview
This skill defines the mandatory, strict procedure for handling raw data downloads (like Icecat ZIPs, CSVs, or manufacturer specs) for the ArmaPC project. It ensures data is always stored safely on the designated USB drive ("JORGE") without relying on fragile drive letters, and protects irreplaceable backups.

## Dependencies
None.

## Quick Start
Whenever the user requests downloading raw data, searching for new catalog components, or retrieving Icecat files, trigger this workflow BEFORE doing any file I/O.

## Workflow

### 1. Verify USB Connection
- **Action:** Open a PowerShell terminal and run the following command to dynamically find the USB drive:
  `Get-Volume | Where-Object FileSystemLabel -eq 'JORGE'`
- **Reason:** Windows drive letters change. Never hardcode `D:` or `E:`. Always extract the current `DriveLetter` from the output of this command.

### 2. Enforce Hard Stop on Missing USB
- **Action:** If the command returns empty (the USB is not connected), you MUST halt execution immediately.
- **Action:** Tell the user: "La memoria USB JORGE no está conectada. Por favor conéctala para continuar."
- **Restriction:** Do NOT attempt to save raw files temporarily on the `C:` drive or any local folder. Wait for the user to connect it.

### 3. Store Raw Data
- **Action:** Once verified, save all raw downloads (Icecat ZIPs, CSVs, PDFs) into `<DriveLetter>:\catalogo-investigacion-ARCHIVO\`.
- **Action:** Name the downloaded files descriptively using the pattern: `ORIGEN_CATEGORIA_que-contiene_fecha`.

### 4. Protect Backups
- **Action:** NEVER delete or overwrite the original Icecat backup zip (e.g., `…_RESPALDO-ORIGINAL.zip`). It is the only copy of the initial database.

## Common Mistakes
- **Assuming the drive letter:** Forgetting to run `Get-Volume` and assuming the USB is still in `D:`.
- **Saving to local disk:** Bypassing the USB check and saving raw data directly into the Next.js `public/` or `catalogo/` folders.
- **Deleting the original ZIP:** Trying to clean up space on the USB and deleting the master `.zip` backup.
