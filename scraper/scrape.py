#!/usr/bin/env python3
"""
ActuaryList Job Scraper (Selenium + BeautifulSoup)
Scrapes jobs from https://www.actuarylist.com and saves to database
"""

import time
import json
import re
import sys
import os
from datetime import datetime, timedelta
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup

# Add backend directory to path for imports
sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'backend'))
from app import create_app
from models.job import Job
from db import db


class ActuaryListScraper:
    def __init__(self):
        self.base_url = "https://www.actuarylist.com"
        self.driver = None
        self.jobs = []
        self.app = None

    def setup_driver(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless=new")
        chrome_options.add_argument("--disable-blink-features=AutomationControlled")
        chrome_options.add_argument("--disable-gpu")
        chrome_options.add_argument("--no-sandbox")
        chrome_options.add_argument("--disable-dev-shm-usage")
        chrome_options.add_argument("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36")

        self.driver = webdriver.Chrome(
            service=Service(ChromeDriverManager().install()),
            options=chrome_options
        )
        self.driver.implicitly_wait(10)

    def setup_flask_app(self):
        """Setup Flask app context for DB"""
        self.app = create_app()
        self.app_context = self.app.app_context()
        self.app_context.push()

    def parse_date(self, date_text):
        if not date_text:
            return datetime.now().strftime("%Y-%m-%d")
        date_text = date_text.lower().strip()
        now = datetime.now()

        if "h ago" in date_text:
            hours = re.search(r'(\d+)h ago', date_text)
            if hours:
                return (now - timedelta(hours=int(hours.group(1)))).strftime("%Y-%m-%d")

        if "d ago" in date_text:
            days = re.search(r'(\d+)d ago', date_text)
            if days:
                return (now - timedelta(days=int(days.group(1)))).strftime("%Y-%m-%d")

        if "week" in date_text:
            weeks = re.search(r'(\d+)\s*week', date_text)
            if weeks:
                return (now - timedelta(weeks=int(weeks.group(1)))).strftime("%Y-%m-%d")

        if "month" in date_text:
            months = re.search(r'(\d+)\s*month', date_text)
            if months:
                return (now - timedelta(days=int(months.group(1)) * 30)).strftime("%Y-%m-%d")

        return now.strftime("%Y-%m-%d")

    def scrape(self, max_jobs=100):
        """Main scraping"""
        self.setup_driver()
        self.setup_flask_app()

        self.driver.get(self.base_url)
        time.sleep(5)

        # Try cookie popup
        try:
            accept_button = WebDriverWait(self.driver, 5).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Accept') or contains(text(), 'OK') or contains(text(), 'Got it')]"))
            )
            accept_button.click()
            time.sleep(2)
        except TimeoutException:
            pass

        # Scroll to load more jobs
        last_height = self.driver.execute_script("return document.body.scrollHeight")
        for _ in range(6):
            self.driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
            time.sleep(2)
            new_height = self.driver.execute_script("return document.body.scrollHeight")
            if new_height == last_height:
                break
            last_height = new_height

        # Parse with BeautifulSoup
        soup = BeautifulSoup(self.driver.page_source, "html.parser")

        job_grid = soup.find("section", class_=lambda x: x and "Job_grid" in x)
        if not job_grid:
            print("❌ Job grid section not found")
            return []

        job_cards = job_grid.find_all("div", class_=lambda x: x and "job-card" in x)
        print(f"📊 Found {len(job_cards)} job cards")

        for card in job_cards[:max_jobs]:
            company = card.find("p", class_=lambda x: x and "company" in x)
            position = card.find("p", class_=lambda x: x and "position" in x)
            posted_on = card.find("p", class_=lambda x: x and "posted-on" in x)
            location = card.find("a", class_=lambda x: x and "location" in x)

            company_text = company.get_text(strip=True) if company else ""
            position_text = position.get_text(strip=True) if position else ""
            posted_on_text = self.parse_date(posted_on.get_text(strip=True) if posted_on else "")
            location_text = location.get_text(strip=True) if location else ""

            if not company_text or not position_text:
                continue

            job_data = {
                "title": position_text,
                "company": company_text,
                "location": location_text,
                "city": location_text,
                "country": "Unknown",
                "posting_date": posted_on_text,
                "job_type": "Full-Time",
                "salary": None,
                "tags": [],
                "job_url": self.base_url,
                "is_remote": "Remote" in location_text,
                "scraped_at": datetime.now().isoformat()
            }

            self.jobs.append(job_data)

        return self.jobs

    def save_to_database(self):
        if not self.jobs:
            return 0
        saved_count = 0
        for job_data in self.jobs:
            existing_job = Job.query.filter_by(
                title=job_data['title'],
                company=job_data['company']
            ).first()
            if existing_job:
                continue
            job = Job.from_dict(job_data)
            db.session.add(job)
            saved_count += 1
        db.session.commit()
        print(f"✓ Saved {saved_count} jobs to DB")
        return saved_count

    def save_to_json(self, filename=None):
        if not filename:
            filename = f"actuary_jobs_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(self.jobs, f, indent=2, ensure_ascii=False)
        print(f"✓ Saved {len(self.jobs)} jobs to {filename}")
        return filename


def main():
    scraper = ActuaryListScraper()
    jobs = scraper.scrape(max_jobs=50)

    if jobs:
        scraper.save_to_database()
        scraper.save_to_json()
    else:
        print("❌ No jobs found.")


if __name__ == "__main__":
    main()
