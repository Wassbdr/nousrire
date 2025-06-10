#!/usr/bin/env python3
"""
WebP Image Optimization Script
Converts images to optimized WebP format with quality control.
"""

import argparse
import os
import sys
from pathlib import Path
from PIL import Image, ImageOps
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def optimize_to_webp(input_path, output_path=None, quality=85, lossless=False, method=4):
    """
    Convert and optimize an image to WebP format.
    
    Args:
        input_path (str): Path to input image
        output_path (str): Path for output WebP image (optional)
        quality (int): Quality level 0-100 (ignored if lossless=True)
        lossless (bool): Use lossless compression
        method (int): Compression method 0-6 (higher = better compression, slower)
    """
    try:
        # Open and process image
        with Image.open(input_path) as img:
            # Auto-orient based on EXIF data
            img = ImageOps.exif_transpose(img)
            
            # Convert RGBA to RGB if saving as lossy WebP
            if img.mode == 'RGBA' and not lossless:
                # Create white background
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
                img = background
            
            # Determine output path
            if output_path is None:
                input_file = Path(input_path)
                output_path = input_file.parent / f"{input_file.stem}_optimized.webp"
            
            # Save as WebP
            save_kwargs = {
                'format': 'WebP',
                'optimize': True,
                'method': method
            }
            
            if lossless:
                save_kwargs['lossless'] = True
            else:
                save_kwargs['quality'] = quality
            
            img.save(output_path, **save_kwargs)
            
            # Calculate compression ratio
            original_size = os.path.getsize(input_path)
            optimized_size = os.path.getsize(output_path)
            compression_ratio = (1 - optimized_size / original_size) * 100
            
            logger.info(f"✓ {input_path} -> {output_path}")
            logger.info(f"  Size: {original_size:,} bytes -> {optimized_size:,} bytes ({compression_ratio:.1f}% reduction)")
            
            return output_path
            
    except Exception as e:
        logger.error(f"✗ Failed to process {input_path}: {e}")
        return None

def batch_optimize(input_dir, output_dir=None, quality=85, lossless=False, method=4):
    """
    Batch optimize all images in a directory.
    """
    input_path = Path(input_dir)
    if not input_path.exists():
        logger.error(f"Input directory does not exist: {input_dir}")
        return
    
    # Supported image formats
    supported_formats = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif', '.webp'}
    
    # Find all image files
    image_files = []
    for ext in supported_formats:
        image_files.extend(input_path.glob(f"*{ext}"))
        image_files.extend(input_path.glob(f"*{ext.upper()}"))
    
    if not image_files:
        logger.warning(f"No supported image files found in {input_dir}")
        return
    
    # Create output directory if specified
    if output_dir:
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
    
    logger.info(f"Found {len(image_files)} image(s) to process")
    
    # Process each image
    processed = 0
    for img_file in image_files:
        if output_dir:
            out_file = Path(output_dir) / f"{img_file.stem}.webp"
        else:
            out_file = None
        
        result = optimize_to_webp(
            str(img_file), 
            str(out_file) if out_file else None,
            quality=quality,
            lossless=lossless,
            method=method
        )
        
        if result:
            processed += 1
    
    logger.info(f"Successfully processed {processed}/{len(image_files)} images")

def main():
    parser = argparse.ArgumentParser(description='Convert and optimize images to WebP format')
    parser.add_argument('input', help='Input image file or directory')
    parser.add_argument('-o', '--output', help='Output file or directory')
    parser.add_argument('-q', '--quality', type=int, default=85, 
                       help='Quality level 0-100 (default: 85, ignored for lossless)')
    parser.add_argument('-l', '--lossless', action='store_true',
                       help='Use lossless compression')
    parser.add_argument('-m', '--method', type=int, default=4, choices=range(7),
                       help='Compression method 0-6 (default: 4, higher = better compression)')
    parser.add_argument('--batch', action='store_true',
                       help='Process all images in input directory')
    
    args = parser.parse_args()
    
    # Validate quality
    if not 0 <= args.quality <= 100:
        logger.error("Quality must be between 0 and 100")
        sys.exit(1)
    
    input_path = Path(args.input)
    
    if not input_path.exists():
        logger.error(f"Input path does not exist: {args.input}")
        sys.exit(1)
    
    # Check if we should process a directory or single file
    if input_path.is_dir() or args.batch:
        batch_optimize(
            args.input,
            args.output,
            quality=args.quality,
            lossless=args.lossless,
            method=args.method
        )
    else:
        # Single file processing
        result = optimize_to_webp(
            args.input,
            args.output,
            quality=args.quality,
            lossless=args.lossless,
            method=args.method
        )
        
        if not result:
            sys.exit(1)

if __name__ == '__main__':
    main()
