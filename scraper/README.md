# ActuaryList Job Scraper

This scraper extracts job listings from https://www.actuarylist.com and saves them to the database.

## Features

- Scrapes job title, company, location, posting date, job type, and tags
- Handles dynamic content loading with scrolling
- Avoids duplicate entries
- Saves to both database and JSON backup
- Robust error handling and validation

## Setup

1. Make sure Chrome browser is installed
2. Install ChromeDriver (or use webdriver-manager)
3. Set up the backend Flask application first
4. Configure database connection in backend/.env

## Usage

### Command Line
\`\`\`bash
# Make script executable
chmod +x run_scraper.sh

# Run scraper
./run_scraper.sh
\`\`\`

### Python
\`\`\`bash
cd scraper
python run_scraper.py
\`\`\`

### From Backend API
You can also trigger scraping via the Flask API (if implemented).

## Configuration

- `max_jobs`: Maximum number of jobs to scrape (default: 100)
- Modify `actuarial_tags` in scrape.py to customize tag extraction
- Adjust scroll count and timing in `scrape_jobs()` method

## Output

- Jobs are saved to the database via SQLAlchemy
- Backup JSON file is created with timestamp
- Console output shows progress and summary

## Troubleshooting

- If scraping fails, check if the website structure has changed
- Ensure ChromeDriver version matches your Chrome browser
- Check database connection and permissions
- Review console output for specific error messages
