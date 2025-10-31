from flask import Blueprint, request, jsonify
from sqlalchemy import or_, desc, asc
from models.job import Job
from db import db
from datetime import datetime

job_bp = Blueprint('jobs', __name__)

@job_bp.route('/jobs', methods=['GET'])
def get_jobs():
    """Get all jobs with optional filtering and sorting"""
    try:
        # Get query parameters
        job_type = request.args.get('job_type')
        location = request.args.get('location')
        city = request.args.get('city')
        country = request.args.get('country')
        tag = request.args.get('tag')
        search = request.args.get('search')
        sort = request.args.get('sort', 'posting_date_desc')
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        
        # Build query
        query = Job.query
        
        # Apply filters
        if job_type:
            query = query.filter(Job.job_type == job_type)
            
        if location:
            query = query.filter(Job.location.ilike(f'%{location}%'))
            
        if city:
            query = query.filter(Job.city.ilike(f'%{city}%'))
            
        if country:
            query = query.filter(Job.country.ilike(f'%{country}%'))
            
        if tag:
            query = query.filter(Job.tags.ilike(f'%{tag}%'))
            
        if search:
            query = query.filter(
                or_(
                    Job.title.ilike(f'%{search}%'),
                    Job.company.ilike(f'%{search}%'),
                    Job.location.ilike(f'%{search}%')
                )
            )
        
        # Apply sorting
        if sort == 'posting_date_desc':
            query = query.order_by(desc(Job.posting_date))
        elif sort == 'posting_date_asc':
            query = query.order_by(asc(Job.posting_date))
        elif sort == 'title_asc':
            query = query.order_by(asc(Job.title))
        elif sort == 'title_desc':
            query = query.order_by(desc(Job.title))
        elif sort == 'company_asc':
            query = query.order_by(asc(Job.company))
        elif sort == 'company_desc':
            query = query.order_by(desc(Job.company))
        else:
            query = query.order_by(desc(Job.posting_date))
        
        # Paginate results
        jobs = query.paginate(
            page=page, 
            per_page=per_page, 
            error_out=False
        )
        
        return jsonify({
            'jobs': [job.to_dict() for job in jobs.items],
            'total': jobs.total,
            'pages': jobs.pages,
            'current_page': jobs.page,
            'per_page': jobs.per_page,
            'has_next': jobs.has_next,
            'has_prev': jobs.has_prev
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@job_bp.route('/jobs/<int:job_id>', methods=['GET'])
def get_job(job_id):
    """Get a specific job by ID"""
    try:
        job = Job.query.get(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        return jsonify(job.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@job_bp.route('/jobs', methods=['POST'])
def create_job():
    """Create a new job"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Create job from data
        job = Job.from_dict(data)
        
        # Validate job
        errors = job.validate()
        if errors:
            return jsonify({'error': 'Validation failed', 'details': errors}), 400
        
        # Save to database
        db.session.add(job)
        db.session.commit()
        
        return jsonify(job.to_dict()), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@job_bp.route('/jobs/<int:job_id>', methods=['PUT'])
def update_job(job_id):
    """Update an existing job"""
    try:
        job = Job.query.get(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        # Update job fields
        if 'title' in data:
            job.title = data['title']
        if 'company' in data:
            job.company = data['company']
        if 'location' in data:
            job.location = data['location']
        if 'city' in data:
            job.city = data['city']
        if 'country' in data:
            job.country = data['country']
        if 'posting_date' in data:
            posting_date = data['posting_date']
            if isinstance(posting_date, str):
                try:
                    job.posting_date = datetime.strptime(posting_date, '%Y-%m-%d').date()
                except ValueError:
                    return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400
        if 'job_type' in data:
            job.job_type = data['job_type']
        if 'tags' in data:
            tags = data['tags']
            if isinstance(tags, list):
                job.tags = ','.join(tags) if tags else ''
            else:
                job.tags = str(tags) if tags else ''
        if 'salary' in data:
            job.salary = data['salary']
        
        job.updated_at = datetime.utcnow()
        
        # Validate updated job
        errors = job.validate()
        if errors:
            return jsonify({'error': 'Validation failed', 'details': errors}), 400
        
        db.session.commit()
        
        return jsonify(job.to_dict()), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@job_bp.route('/jobs/<int:job_id>', methods=['DELETE'])
def delete_job(job_id):
    """Delete a job"""
    try:
        job = Job.query.get(job_id)
        if not job:
            return jsonify({'error': 'Job not found'}), 404
        
        db.session.delete(job)
        db.session.commit()
        
        return jsonify({'message': 'Job deleted successfully'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@job_bp.route('/jobs/stats', methods=['GET'])
def get_job_stats():
    """Get job statistics"""
    try:
        total_jobs = Job.query.count()
        
        # Job types distribution
        job_types = db.session.query(
            Job.job_type, 
            db.func.count(Job.id).label('count')
        ).group_by(Job.job_type).all()
        
        # Top companies
        top_companies = db.session.query(
            Job.company, 
            db.func.count(Job.id).label('count')
        ).group_by(Job.company).order_by(desc(db.func.count(Job.id))).limit(10).all()
        
        # Top locations
        top_locations = db.session.query(
            Job.city, 
            db.func.count(Job.id).label('count')
        ).filter(Job.city.isnot(None)).group_by(Job.city).order_by(desc(db.func.count(Job.id))).limit(10).all()
        
        return jsonify({
            'total_jobs': total_jobs,
            'job_types': [{'type': jt[0], 'count': jt[1]} for jt in job_types],
            'top_companies': [{'company': tc[0], 'count': tc[1]} for tc in top_companies],
            'top_locations': [{'city': tl[0], 'count': tl[1]} for tl in top_locations]
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
