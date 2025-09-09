import os
from flask import jsonify, request, current_app
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import app, db
from .models import User

# Configure upload settings
UPLOAD_FOLDER = 'uploads/profile_photos'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/users/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    return jsonify(user.to_dict())

@app.route('/api/users/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    data = request.form
    
    if 'name' in data:
        user.name = data['name']
    if 'designation' in data:
        user.designation = data['designation']
    if 'email' in data:
        # Check if email is already taken
        existing_user = User.query.filter_by(email=data['email']).first()
        if existing_user and existing_user.id != user_id:
            return jsonify({'error': 'Email already in use'}), 400
        user.email = data['email']
    
    # Handle profile photo upload
    if 'profile_photo' in request.files:
        file = request.files['profile_photo']
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Create upload directory if it doesn't exist
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)
            # Save file with user_id prefix to avoid filename conflicts
            file_path = os.path.join(UPLOAD_FOLDER, f"{user_id}_{filename}")
            file.save(file_path)
            user.profile_photo = file_path
    
    db.session.commit()
    return jsonify(user.to_dict())

@app.route('/api/users/profile/photo', methods=['POST'])
@jwt_required()
def upload_profile_photo():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    if 'profile_photo' not in request.files:
        return jsonify({'error': 'No file provided'}), 400
    
    file = request.files['profile_photo']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        # Create upload directory if it doesn't exist
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        # Save file with user_id prefix to avoid filename conflicts
        file_path = os.path.join(UPLOAD_FOLDER, f"{user_id}_{filename}")
        file.save(file_path)
        user.profile_photo = file_path
        db.session.commit()
        return jsonify({'message': 'Photo uploaded successfully', 'photo_path': file_path})
    
    return jsonify({'error': 'Invalid file type'}), 400

@app.route('/api/users/change-password', methods=['POST'])
@jwt_required()
def change_password():
    user_id = get_jwt_identity()
    user = User.query.get_or_404(user_id)
    
    data = request.get_json()
    if not user.check_password(data['current_password']):
        return jsonify({'error': 'Current password is incorrect'}), 400
    
    user.set_password(data['new_password'])
    db.session.commit()
    
    return jsonify({'message': 'Password changed successfully'}) 