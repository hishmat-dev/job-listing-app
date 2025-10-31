from db import db
from datetime import datetime
from sqlalchemy import func

class Job(db.Model):
    __tablename__ = 'jobs'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(200), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    city = db.Column(db.String(100))
    country = db.Column(db.String(100))
    posting_date = db.Column(db.Date, nullable=False, default=datetime.utcnow().date())
    job_type = db.Column(db.String(50), nullable=False, default='Full-Time')
    tags = db.Column(db.Text)  # Comma-separated tags
    salary = db.Column(db.String(100))
    scraped_at = db.Column(db.DateTime, default=datetime.utcnow)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def __repr__(self):
        return f'<Job {self.title} at {self.company}>'
    
    def to_dict(self):
        """Convert job object to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'title': self.title,
            'company': self.company,
            'location': self.location,
            'city': self.city,
            'country': self.country,
            'posting_date': self.posting_date.isoformat() if self.posting_date else None,
            'job_type': self.job_type,
            'tags': self.tags.split(',') if self.tags else [],
            'salary': self.salary,
            'scraped_at': self.scraped_at.isoformat() if self.scraped_at else None,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
    
    @classmethod
    def from_dict(cls, data):
        """Create job object from dictionary"""
        job = cls()
        job.title = data.get('title', '')
        job.company = data.get('company', '')
        job.location = data.get('location', '')
        job.city = data.get('city', '')
        job.country = data.get('country', '')
        
        # Handle posting_date
        posting_date = data.get('posting_date')
        if posting_date:
            if isinstance(posting_date, str):
                try:
                    job.posting_date = datetime.strptime(posting_date, '%Y-%m-%d').date()
                except ValueError:
                    job.posting_date = datetime.utcnow().date()
            else:
                job.posting_date = posting_date
        
        job.job_type = data.get('job_type', 'Full-Time')
        
        # Handle tags
        tags = data.get('tags', [])
        if isinstance(tags, list):
            job.tags = ','.join(tags) if tags else ''
        else:
            job.tags = str(tags) if tags else ''
            
        job.salary = data.get('salary', '')
        
        return job
    
    def validate(self):
        """Validate job data"""
        errors = []
        
        if not self.title or not self.title.strip():
            errors.append('Title is required')
        
        if not self.company or not self.company.strip():
            errors.append('Company is required')
            
        if not self.location or not self.location.strip():
            errors.append('Location is required')
            
        if self.job_type not in ['Full-Time', 'Part-Time', 'Contract', 'Internship']:
            errors.append('Invalid job type')
            
        return errors
