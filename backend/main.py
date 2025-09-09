# from flask import Flask, jsonify, request, send_from_directory
# from flask_cors import CORS
# from flask_sqlalchemy import SQLAlchemy
# from flask_migrate import Migrate
# import os
# import yaml
# import requests
# import time
# import json
# from datetime import datetime, timedelta
# import logging
# from sqlalchemy import text

# # Set up logging
# logging.basicConfig(level=logging.INFO)
# logger = logging.getLogger(__name__)

# print("#### main.py version X loaded ####")

# app = Flask(__name__)
# CORS(app, resources={r"/*": {"methods": ["POST", "OPTIONS", "GET", "PUT", "DELETE"], "origins": "*"}})

# # Database config
# app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://kk_user:kk_password@localhost:5432/kk_app')
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
# db = SQLAlchemy(app)
# migrate = Migrate(app, db)

# # Model Definitions
# class Project(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(128), nullable=False)
#     description = db.Column(db.Text)
#     test_type = db.Column(db.String(128))
#     testing_by = db.Column(db.String(128))
#     start_date = db.Column(db.Date)
#     base_url = db.Column(db.String(256))
#     manual_test_cases = db.relationship('ManualTestCase', backref='project', lazy=True)
#     api_manual_test_cases = db.relationship('APIManualTestCase', backref='project', lazy=True)
#     runs = db.relationship('ProjectRun', backref='project', lazy=True, order_by='desc(ProjectRun.run_time)')

# class ManualTestCase(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     test_id = db.Column(db.String(64), nullable=False)
#     title = db.Column(db.String(256), nullable=False)
#     description = db.Column(db.Text)
#     preconditions = db.Column(db.Text)
#     steps = db.Column(db.Text)
#     expected = db.Column(db.Text)
#     actual = db.Column(db.Text)
#     status = db.Column(db.String(32))
#     priority = db.Column(db.String(32))
#     assigned_to = db.Column(db.String(128))
#     comments = db.Column(db.Text)
#     created_at = db.Column(db.DateTime, server_default=db.func.now())
#     updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
#     project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

# class APIManualTestCase(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     test_id = db.Column(db.String(64), nullable=False)
#     test_case = db.Column(db.String(256), nullable=False)
#     request_type = db.Column(db.String(16))
#     endpoint = db.Column(db.String(256))
#     request = db.Column(db.Text)
#     response = db.Column(db.Text)
#     assertion_type = db.Column(db.String(64))
#     expected_status = db.Column(db.String(64))
#     to_replace = db.Column(db.String(256))
#     add_to_context_value = db.Column(db.String(256))
#     add_to_context_key = db.Column(db.String(256))
#     created_at = db.Column(db.DateTime, server_default=db.func.now())
#     updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
#     project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

# class AutomationScript(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
#     name = db.Column(db.String(256), nullable=False)
#     endpoint = db.Column(db.String(256))
#     method = db.Column(db.String(16))
#     description = db.Column(db.Text)
#     base_url = db.Column(db.String(256))
#     request_body_template = db.Column(db.Text)
#     headers = db.Column(db.Text)
#     query_params = db.Column(db.Text)
#     path_params = db.Column(db.Text)
#     expected_status_code = db.Column(db.Integer)
#     last_run_status = db.Column(db.String(32), default='Not Run')
#     last_run_status_code = db.Column(db.Integer)
#     last_run_response_time = db.Column(db.Float)
#     last_run_response_body = db.Column(db.Text)
#     last_run_error = db.Column(db.Text)
#     created_at = db.Column(db.DateTime, server_default=db.func.now())
#     updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

# class ProjectRun(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
#     run_time = db.Column(db.DateTime, server_default=db.func.now())
#     status = db.Column(db.String(32), default='completed')
#     score = db.Column(db.Integer)
#     quality_score = db.Column(db.Integer)
#     execution_score = db.Column(db.Integer)
#     success_score = db.Column(db.Integer)
#     env = db.Column(db.String(32), default='Dev')

# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     name = db.Column(db.String(128), nullable=False)
#     email = db.Column(db.String(128), unique=True, nullable=False)
#     role = db.Column(db.String(64))

# # Initialize database
# def init_db():
#     try:
#         # Create all tables
#         with app.app_context():
#             db.create_all()
#             logger.info("Database tables created successfully")

#             # Create sample data if no projects exist
#             if Project.query.count() == 0:
#                 create_sample_data()
#                 logger.info("Sample data created successfully")
#     except Exception as e:
#         logger.error(f"Error creating database tables: {e}")
#         raise

# def create_sample_data():
#     try:
#         # Create sample projects
#         project1 = Project(
#             name="E-commerce Platform",
#             description="Testing the main e-commerce platform functionality",
#             test_type="UI Automation",
#             testing_by="QA Team",
#             start_date=datetime.now().date(),
#             base_url="https://api.ecommerce.example.com"
#         )

#         project2 = Project(
#             name="Payment Gateway",
#             description="Testing payment processing and transactions",
#             test_type="API Testing",
#             testing_by="Integration Team",
#             start_date=datetime.now().date(),
#             base_url="https://api.payments.example.com"
#         )

#         db.session.add_all([project1, project2])
#         db.session.commit()

#         # Create sample runs for project1
#         run1 = ProjectRun(
#             project=project1,
#             score=85,
#             quality_score=90,
#             coverage_score=80,
#             execution_score=85,
#             success_score=88,
#             env="Dev"
#         )

#         run2 = ProjectRun(
#             project=project1,
#             score=88,
#             quality_score=92,
#             coverage_score=85,
#             execution_score=87,
#             success_score=90,
#             env="Staging"
#         )

#         # Create sample runs for project2
#         run3 = ProjectRun(
#             project=project2,
#             score=92,
#             quality_score=95,
#             coverage_score=90,
#             execution_score=93,
#             success_score=95,
#             env="Dev"
#         )

#         db.session.add_all([run1, run2, run3])

#         # Create sample manual test cases for project1
#         manual_test1 = ManualTestCase(
#             test_id="TC001",
#             title="User Login Test",
#             description="Verify user can login with valid credentials",
#             steps="1. Navigate to login page\n2. Enter valid credentials\n3. Click login button",
#             expected="User should be logged in successfully",
#             status="Passed",
#             priority="High",
#             assigned_to="John Doe",
#             project=project1
#         )

#         manual_test2 = ManualTestCase(
#             test_id="TC002",
#             title="Product Search Test",
#             description="Verify product search functionality",
#             steps="1. Go to search bar\n2. Enter product name\n3. Press enter",
#             expected="Search results should display matching products",
#             status="Passed",
#             priority="Medium",
#             assigned_to="Jane Smith",
#             project=project1
#         )

#         # Create sample API test cases for project2
#         api_test1 = APIManualTestCase(
#             test_id="API001",
#             test_case="Payment Processing Test",
#             request_type="POST",
#             endpoint="/api/payments/process",
#             request='{"amount": 100, "currency": "USD", "card": "4111111111111111"}',
#             response='{"status": "success", "transaction_id": "12345"}',
#             assertion_type="Positive",
#             expected_status="200",
#             project=project2
#         )

#         api_test2 = APIManualTestCase(
#             test_id="API002",
#             test_case="Invalid Payment Test",
#             request_type="POST",
#             endpoint="/api/payments/process",
#             request='{"amount": -100, "currency": "USD", "card": "4111111111111111"}',
#             response='{"status": "error", "message": "Invalid amount"}',
#             assertion_type="Negative",
#             expected_status="400",
#             project=project2
#         )

#         # Create sample automation scripts
#         script1 = AutomationScript(
#             name="Login Automation",
#             endpoint="/api/auth/login",
#             method="POST",
#             description="Automated login test script",
#             base_url="https://api.ecommerce.example.com",
#             request_body_template='{"username": "testuser", "password": "testpass"}',
#             expected_status_code=200,
#             project=project1
#         )

#         script2 = AutomationScript(
#             name="Payment Processing",
#             endpoint="/api/payments/process",
#             method="POST",
#             description="Automated payment processing test",
#             base_url="https://api.payments.example.com",
#             request_body_template='{"amount": 100, "currency": "USD", "card": "4111111111111111"}',
#             expected_status_code=200,
#             project=project2
#         )

#         db.session.add_all([manual_test1, manual_test2, api_test1, api_test2, script1, script2])

#         # Create sample users
#         user1 = User(
#             name="John Doe",
#             email="john.doe@example.com",
#             role="QA Engineer"
#         )

#         user2 = User(
#             name="Jane Smith",
#             email="jane.smith@example.com",
#             role="Test Lead"
#         )

#         user3 = User(
#             name="Bob Wilson",
#             email="bob.wilson@example.com",
#             role="Developer"
#         )

#         db.session.add_all([user1, user2, user3])
#         db.session.commit()

#     except Exception as e:
#         logger.error(f"Error creating sample data: {e}")
#         db.session.rollback()
#         raise

# # Test database connection
# @app.before_request
# def test_db_connection():
#     print('Running test_db_connection: fresh implementation')
#     logger.info("Entering test_db_connection function")
#     if not hasattr(app, '_db_connection_tested'):
#         logger.info("Database connection not yet tested. Attempting connection.")
#         try:
#             # Test connection using a simple query with proper SQLAlchemy text
#             result = db.session.execute(text('SELECT 1')).scalar()
#             if result == 1:
#                 logger.info("Database connection successful")
#                 app._db_connection_tested = True
#             else:
#                 # Log failure but don't necessarily raise immediately if connection string is valid but DB is down
#                 # Depending on desired behavior, could raise here: raise Exception("Database connection test failed unexpectedly")
#                 logger.warning("Database connection test returned unexpected result, but connection seems open.")
#         except Exception as e:
#             logger.error(f"Database connection error during test: {e}")
#             db.session.rollback()
#             # Re-raise the exception to stop the request if the connection fails
#             raise
#         finally:
#             # Ensure session is closed or rolled back if anything goes wrong
#             if db.session.dirty or db.session.new or db.session.deleted:
#                 db.session.rollback()

#     logger.info("Exiting test_db_connection function")

# # Error handlers
# @app.errorhandler(404)
# def not_found_error(error):
#     return jsonify({'error': 'Not found'}), 404

# @app.errorhandler(500)
# def internal_error(error):
#     db.session.rollback()
#     return jsonify({'error': 'Internal server error'}), 500

# # Product routes (fetch real data from Project model)
# @app.route('/api/products', methods=['GET'])
# def get_products():
#     try:
#         projects = Project.query.all()
#         products = [
#             {
#                 'id': project.id,
#                 'name': project.name,
#                 'description': project.description,
#                 'test_type': project.test_type,
#                 'testing_by': project.testing_by,
#                 'start_date': project.start_date.isoformat() if project.start_date else None,
#                 'base_url': project.base_url
#             }
#             for project in projects
#         ]
#         return jsonify(products)
#     except Exception as e:
#         logger.error(f"Error fetching products: {e}")
#         return jsonify({'error': 'Failed to fetch products'}), 500

# # User routes
# @app.route('/api/users', methods=['GET'])
# def get_users():
#     try:
#         # Query all users from the database
#         users = User.query.all()
#         # Convert to list of dictionaries
#         user_list = [
#             {
#                 'id': user.id,
#                 'name': user.name,
#                 'email': user.email,
#                 'role': user.role
#             }
#             for user in users
#         ]
#         return jsonify(user_list)
#     except Exception as e:
#         logger.error(f"Error fetching users: {e}")
#         return jsonify({'error': 'Failed to fetch users'}), 500

# # Manual DB initialization endpoint
# @app.route('/api/init-db', methods=['GET'])
# def manual_init_db():
#     try:
#         init_db()
#         return jsonify({'message': 'Database initialization and sample data creation triggered successfully.'}), 200
#     except Exception as e:
#         logger.error(f"Manual database initialization error: {e}")
#         return jsonify({'error': f'Failed to trigger database initialization: {e}'}), 500

# # Test Cases routes
# @app.route('/api/test-cases', methods=['GET'])
# def get_test_cases():
#     try:
#         project_id = request.args.get('project_id', type=int)
#         if project_id:
#             test_cases = ManualTestCase.query.filter_by(project_id=project_id).all()
#         else:
#             test_cases = ManualTestCase.query.all()

#         test_cases_list = [
#             {
#                 'id': tc.id,
#                 'test_id': tc.test_id,
#                 'title': tc.title,
#                 'description': tc.description,
#                 'status': tc.status,
#                 'priority': tc.priority,
#                 'assigned_to': tc.assigned_to,
#                 'project_id': tc.project_id
#             }
#             for tc in test_cases
#         ]
#         return jsonify(test_cases_list)
#     except Exception as e:
#         logger.error(f"Error fetching test cases: {e}")
#         return jsonify({'error': 'Failed to fetch test cases'}), 500

# # Call init_db and run the application
# if __name__ == '__main__':
#     # The manual endpoint is available, so we don't necessarily need to auto-init here
#     # init_db()
#     app.run(debug=True) 







from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
import yaml
import requests
import time
import json
from datetime import datetime, timedelta
import logging
from sqlalchemy import text

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

print("#### main.py version X loaded ####")

app = Flask(__name__)
CORS(app, resources={r"/*": {"methods": ["POST", "OPTIONS", "GET", "PUT", "DELETE"], "origins": "*"}})

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'postgresql://kk_user:kk_password@localhost:5432/kk_app')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Model Definitions
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    description = db.Column(db.Text)
    test_type = db.Column(db.String(128))
    testing_by = db.Column(db.String(128))
    start_date = db.Column(db.Date)
    base_url = db.Column(db.String(256))
    manual_test_cases = db.relationship('ManualTestCase', backref='project', lazy=True)
    api_manual_test_cases = db.relationship('APIManualTestCase', backref='project', lazy=True)
    runs = db.relationship('ProjectRun', backref='project', lazy=True, order_by='ProjectRun.run_time desc')

class ManualTestCase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.String(64), nullable=False)
    title = db.Column(db.String(256), nullable=False)
    description = db.Column(db.Text)
    preconditions = db.Column(db.Text)
    steps = db.Column(db.Text)
    expected = db.Column(db.Text)
    actual = db.Column(db.Text)
    status = db.Column(db.String(32))
    priority = db.Column(db.String(32))
    assigned_to = db.Column(db.String(128))
    comments = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

class APIManualTestCase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    test_id = db.Column(db.String(64), nullable=False)
    test_case = db.Column(db.String(256), nullable=False)
    request_type = db.Column(db.String(16))
    endpoint = db.Column(db.String(256))
    request = db.Column(db.Text)
    response = db.Column(db.Text)
    assertion_type = db.Column(db.String(64))
    expected_status = db.Column(db.String(64))
    to_replace = db.Column(db.String(256))
    add_to_context_value = db.Column(db.String(256))
    add_to_context_key = db.Column(db.String(256))
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)

class AutomationScript(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    name = db.Column(db.String(256), nullable=False)
    endpoint = db.Column(db.String(256))
    method = db.Column(db.String(16))
    description = db.Column(db.Text)
    base_url = db.Column(db.String(256))
    request_body_template = db.Column(db.Text)
    headers = db.Column(db.Text)
    query_params = db.Column(db.Text)
    path_params = db.Column(db.Text)
    expected_status_code = db.Column(db.Integer)
    last_run_status = db.Column(db.String(32), default='Not Run')
    last_run_status_code = db.Column(db.Integer)
    last_run_response_time = db.Column(db.Float)
    last_run_response_body = db.Column(db.Text)
    last_run_error = db.Column(db.Text)
    created_at = db.Column(db.DateTime, server_default=db.func.now())
    updated_at = db.Column(db.DateTime, server_default=db.func.now(), onupdate=db.func.now())

class ProjectRun(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey('project.id'), nullable=False)
    run_time = db.Column(db.DateTime, server_default=db.func.now())
    status = db.Column(db.String(32), default='completed')
    score = db.Column(db.Integer)
    quality_score = db.Column(db.Integer)
    execution_score = db.Column(db.Integer)
    success_score = db.Column(db.Integer)
    env = db.Column(db.String(32), default='Dev')

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), unique=True, nullable=False)
    role = db.Column(db.String(64))

# Initialize database
def init_db():
    try:
        with app.app_context():
            db.create_all()
            logger.info("Database tables created successfully")
            if Project.query.count() == 0:
                create_sample_data()
                logger.info("Sample data created successfully")
    except Exception as e:
        logger.error(f"Error creating database tables: {e}")
        raise

def create_sample_data():
    try:
        # Create sample projects
        project1 = Project(
            name="E-commerce Platform",
            description="Testing the main e-commerce platform functionality",
            test_type="UI Automation",
            testing_by="QA Team",
            start_date=datetime.now().date(),
            base_url="https://api.ecommerce.example.com"
        )
        project2 = Project(
            name="Payment Gateway",
            description="Testing payment processing and transactions",
            test_type="API Testing",
            testing_by="Integration Team",
            start_date=datetime.now().date(),
            base_url="https://api.payments.example.com"
        )
        db.session.add_all([project1, project2])
        db.session.commit()

        # Create sample runs for project1
        run1 = ProjectRun(
            project=project1,
            score=85,
            quality_score=90,
            execution_score=85,
            success_score=88,
            env="Dev"
        )
        run2 = ProjectRun(
            project=project1,
            score=88,
            quality_score=92,
            execution_score=87,
            success_score=90,
            env="Staging"
        )
        # Create sample runs for project2
        run3 = ProjectRun(
            project=project2,
            score=92,
            quality_score=95,
            execution_score=93,
            success_score=95,
            env="Dev"
        )
        db.session.add_all([run1, run2, run3])

        # Create sample manual test cases for project1
        manual_test1 = ManualTestCase(
            test_id="TC001",
            title="User Login Test",
            description="Verify user can login with valid credentials",
            steps="1. Navigate to login page\n2. Enter valid credentials\n3. Click login button",
            expected="User should be logged in successfully",
            status="Passed",
            priority="High",
            assigned_to="John Doe",
            project=project1
        )
        manual_test2 = ManualTestCase(
            test_id="TC002",
            title="Product Search Test",
            description="Verify product search functionality",
            steps="1. Go to search bar\n2. Enter product name\n3. Press enter",
            expected="Search results should display matching products",
            status="Passed",
            priority="Medium",
            assigned_to="Jane Smith",
            project=project1
        )

        # Create sample API test cases for project2
        api_test1 = APIManualTestCase(
            test_id="API001",
            test_case="Payment Processing Test",
            request_type="POST",
            endpoint="/api/payments/process",
            request='{"amount": 100, "currency": "USD", "card": "4111111111111111"}',
            response='{"status": "success", "transaction_id": "12345"}',
            assertion_type="Positive",
            expected_status="200",
            project=project2
        )
        api_test2 = APIManualTestCase(
            test_id="API002",
            test_case="Invalid Payment Test",
            request_type="POST",
            endpoint="/api/payments/process",
            request='{"amount": -100, "currency": "USD", "card": "4111111111111111"}',
            response='{"status": "error", "message": "Invalid amount"}',
            assertion_type="Negative",
            expected_status="400",
            project=project2
        )

        # Create sample automation scripts
        script1 = AutomationScript(
            name="Login Automation",
            endpoint="/api/auth/login",
            method="POST",
            description="Automated login test script",
            base_url="https://api.ecommerce.example.com",
            request_body_template='{"username": "testuser", "password": "testpass"}',
            expected_status_code=200,
            project=project1
        )
        script2 = AutomationScript(
            name="Payment Processing",
            endpoint="/api/payments/process",
            method="POST",
            description="Automated payment processing test",
            base_url="https://api.payments.example.com",
            request_body_template='{"amount": 100, "currency": "USD", "card": "4111111111111111"}',
            expected_status_code=200,
            project=project2
        )

        # Create sample users
        user1 = User(
            name="John Doe",
            email="john.doe@example.com",
            role="QA Engineer"
        )
        user2 = User(
            name="Jane Smith",
            email="jane.smith@example.com",
            role="Test Lead"
        )
        user3 = User(
            name="Bob Wilson",
            email="bob.wilson@example.com",
            role="Developer"
        )

        db.session.add_all([manual_test1, manual_test2, api_test1, api_test2, script1, script2, user1, user2, user3])
        db.session.commit()

    except Exception as e:
        logger.error(f"Error creating sample data: {e}")
        db.session.rollback()
        raise

# Test database connection
@app.before_request
def test_db_connection():
    print('Running test_db_connection: fresh implementation')
    logger.info("Entering test_db_connection function")
    if not hasattr(app, '_db_connection_tested'):
        logger.info("Database connection not yet tested. Attempting connection.")
        try:
            result = db.session.execute(text('SELECT 1')).scalar()
            if result == 1:
                logger.info("Database connection successful")
                app._db_connection_tested = True
            else:
                logger.warning("Database connection test returned unexpected result, but connection seems open.")
        except Exception as e:
            logger.error(f"Database connection error during test: {e}")
            db.session.rollback()
            raise
        finally:
            if db.session.dirty or db.session.new or db.session.deleted:
                db.session.rollback()
    logger.info("Exiting test_db_connection function")

# Error handlers
@app.errorhandler(404)
def not_found_error(error):
    return jsonify({'error': 'Not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500

# Product routes
@app.route('/api/products', methods=['GET'])
def get_products():
    try:
        projects = Project.query.all()
        products = [
            {
                'id': project.id,
                'name': project.name,
                'description': project.description,
                'test_type': project.test_type,
                'testing_by': project.testing_by,
                'start_date': project.start_date.isoformat() if project.start_date else None,
                'base_url': project.base_url
            }
            for project in projects
        ]
        return jsonify(products)
    except Exception as e:
        logger.error(f"Error fetching products: {e}")
        return jsonify({'error': 'Failed to fetch products'}), 500

# User routes
@app.route('/api/users', methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        user_list = [
            {
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }
            for user in users
        ]
        return jsonify(user_list)
    except Exception as e:
        logger.error(f"Error fetching users: {e}")
        return jsonify({'error': 'Failed to fetch users'}), 500

# Manual DB initialization endpoint
@app.route('/api/init-db', methods=['GET'])
def manual_init_db():
    try:
        init_db()
        return jsonify({'message': 'Database initialization and sample data creation triggered successfully.'}), 200
    except Exception as e:
        logger.error(f"Manual database initialization error: {e}")
        return jsonify({'error': f'Failed to trigger database initialization: {e}'}), 500

# Test Cases routes
@app.route('/api/test-cases', methods=['GET'])
def get_test_cases():
    try:
        project_id = request.args.get('project_id', type=int)
        if project_id:
            test_cases = ManualTestCase.query.filter_by(project_id=project_id).all()
        else:
            test_cases = ManualTestCase.query.all()
        test_cases_list = [
            {
                'id': tc.id,
                'test_id': tc.test_id,
                'title': tc.title,
                'description': tc.description,
                'status': tc.status,
                'priority': tc.priority,
                'assigned_to': tc.assigned_to,
                'project_id': tc.project_id
            }
            for tc in test_cases
        ]
        return jsonify(test_cases_list)
    except Exception as e:
        logger.error(f"Error fetching test cases: {e}")
        return jsonify({'error': 'Failed to fetch test cases'}), 500

if __name__ == '__main__':
    app.run(debug=True)