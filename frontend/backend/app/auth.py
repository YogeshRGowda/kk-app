from datetime import datetime, timedelta
from flask import current_app, url_for
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_mail import Message
from itsdangerous import URLSafeTimedSerializer
from . import mail

def generate_tokens(user_id):
    """Generate access and refresh tokens for a user."""
    access_token = create_access_token(identity=user_id)
    refresh_token = create_refresh_token(identity=user_id)
    return access_token, refresh_token

def generate_email_verification_token(email):
    """Generate a token for email verification."""
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    return serializer.dumps(email, salt='email-verification-salt')

def verify_email_token(token, expiration=3600):
    """Verify the email verification token."""
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    try:
        email = serializer.loads(
            token,
            salt='email-verification-salt',
            max_age=expiration
        )
        return email
    except:
        return None

def send_verification_email(user):
    """Send verification email to user."""
    token = generate_email_verification_token(user.email)
    verify_url = url_for('auth.verify_email', token=token, _external=True)
    
    msg = Message(
        'Verify Your Email',
        sender=current_app.config['MAIL_DEFAULT_SENDER'],
        recipients=[user.email]
    )
    
    msg.body = f'''To verify your email, visit the following link:
{verify_url}

If you did not make this request then simply ignore this email.
'''
    
    mail.send(msg)

def send_password_reset_email(user):
    """Send password reset email to user."""
    token = generate_email_verification_token(user.email)
    reset_url = url_for('auth.reset_password', token=token, _external=True)
    
    msg = Message(
        'Reset Your Password',
        sender=current_app.config['MAIL_DEFAULT_SENDER'],
        recipients=[user.email]
    )
    
    msg.body = f'''To reset your password, visit the following link:
{reset_url}

If you did not make this request then simply ignore this email.
'''
    
    mail.send(msg) 