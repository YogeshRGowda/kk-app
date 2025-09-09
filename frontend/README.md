# KK App

This is a full-stack application with a React/TypeScript frontend and Flask backend.

## Project Structure

```
.
├── backend/             # Flask backend
│   ├── app/            # Application code
│   │   ├── __init__.py # Package initialization
│   │   ├── app.py      # Application factory
│   │   ├── config.py   # Configuration classes
│   │   ├── models.py   # Database models
│   │   └── routes.py   # API routes
│   └── requirements.txt # Python dependencies
│
└── frontend/           # React/TypeScript frontend
    ├── src/           # Source code
    ├── public/        # Static files
    ├── package.json   # Node.js dependencies
    └── ...           # Other frontend configuration files
```

## Backend Setup

1. Create a virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the backend directory with:
   ```
   FLASK_APP=app
   FLASK_ENV=development
   FLASK_DEBUG=1
   DATABASE_URL=postgresql://KK:Yogeshr@1.@localhost:5432/KK
   SECRET_KEY=your-secret-key-here
   ```

4. Initialize the database:
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

5. Run the backend:
   ```bash
   flask run
   ```

## Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

## Development

- Backend runs on http://localhost:5000
- Frontend runs on http://localhost:5173

## API Endpoints

- GET /api/environments - Get list of environments
- GET /api/products - Get list of products (with filtering and pagination)
- POST /api/products - Create a new product
- GET /api/products/<id> - Get a specific product
- POST /api/products/<id>/testblock/<block_id>/update - Update a test block
- GET /api/notifications - Get notifications
- POST /api/notifications/<id>/read - Mark notification as read

## Testing

To run the backend tests:
```bash
cd backend
pytest
```

## Code Style

The project uses:
- Black for Python code formatting
- Flake8 for Python linting
- ESLint for JavaScript/TypeScript linting

To format Python code:
```bash
cd backend
black .
```

To check Python code style:
```bash
cd backend
flake8
```
