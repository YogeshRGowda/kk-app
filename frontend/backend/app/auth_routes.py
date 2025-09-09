from datetime import datetime
from flask import jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token
from . import app, db
from .models import User
from .auth import (
    generate_tokens,
    send_verification_email,
    send_password_reset_email,
    verify_email_token
)

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    user = User(
        email=data['email'],
        name=data.get('name'),
        designation=data.get('designation')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Send verification email
    send_verification_email(user)
    
    return jsonify({
        'message': 'Registration successful. Please check your email to verify your account.',
        'user': user.to_dict()
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    if not user.is_verified:
        return jsonify({'error': 'Please verify your email first'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'Account is deactivated'}), 401
    
    # Update last login
    user.last_login = datetime.utcnow()
    db.session.commit()
    
    # Generate tokens
    access_token, refresh_token = generate_tokens(user.id)
    
    return jsonify({
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    })

@app.route('/api/auth/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    access_token = create_access_token(identity=current_user_id)
    return jsonify({'access_token': access_token})

@app.route('/api/auth/verify-email/<token>')
def verify_email(token):
    email = verify_email_token(token)
    if email is None:
        return jsonify({'error': 'Invalid or expired token'}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    user.is_verified = True
    db.session.commit()
    
    return jsonify({'message': 'Email verified successfully'})

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user:
        send_password_reset_email(user)
    
    return jsonify({'message': 'If an account exists with this email, you will receive a password reset link'})

@app.route('/api/auth/reset-password/<token>', methods=['POST'])
def reset_password(token):
    email = verify_email_token(token)
    if email is None:
        return jsonify({'error': 'Invalid or expired token'}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    user.set_password(data['password'])
    db.session.commit()
    
    return jsonify({'message': 'Password has been reset successfully'}) 