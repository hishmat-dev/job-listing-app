#!/usr/bin/env python3
"""
Simple script to run the scraper
"""

import sys
import os

# Add current directory to path
sys.path.append(os.path.dirname(__file__))

from scrape import main

if __name__ == "__main__":
    main()
