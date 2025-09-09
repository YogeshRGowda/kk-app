from flask import jsonify, request
from . import app, db
from .models import Product, TestBlock, Notification

@app.route('/api/environments', methods=['GET'])
def get_environments():
    environments = ["Dev", "UAT", "Production"]
    return jsonify(environments)

@app.route('/api/products', methods=['GET'])
def get_products():
    env = request.args.get('env')
    search = request.args.get('search', '').lower()
    page = int(request.args.get('page', 1))
    page_size = int(request.args.get('page_size', 6))
    
    query = Product.query
    
    if env:
        query = query.filter(Product.env == env)
    if search:
        query = query.filter(Product.name.ilike(f'%{search}%'))
    
    total = query.count()
    products = query.paginate(page=page, per_page=page_size, error_out=False)
    
    return jsonify({
        "products": [product.to_dict() for product in products.items],
        "total": total,
        "page": page,
        "page_size": page_size
    })

@app.route('/api/products', methods=['POST'])
def add_product():
    data = request.json
    product = Product(
        name=data['name'],
        env=data.get('env', 'Dev'),
        quality_score=data.get('quality_score', 0),
        coverage_score=data.get('coverage_score', 0),
        execution_score=data.get('execution_score', 0),
        success_score=data.get('success_score', 0),
        description=data.get('description', '')
    )
    
    if 'test_blocks' in data:
        for block_data in data['test_blocks']:
            block = TestBlock(
                name=block_data['name'],
                status=block_data['status'],
                score=block_data['score'],
                failures=block_data.get('failures', [])
            )
            product.test_blocks.append(block)
    
    db.session.add(product)
    db.session.commit()
    
    return jsonify(product.to_dict()), 201

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())

@app.route('/api/products/<int:product_id>/testblock/<int:block_id>/update', methods=['POST'])
def update_test_block(product_id, block_id):
    product = Product.query.get_or_404(product_id)
    block = TestBlock.query.filter_by(id=block_id, product_id=product_id).first_or_404()
    
    data = request.json
    block.status = data.get('status', block.status)
    block.score = data.get('score', block.score)
    block.failures = data.get('failures', block.failures)
    
    db.session.commit()
    return jsonify(block.to_dict())

@app.route('/api/notifications', methods=['GET'])
def get_notifications():
    notifications = Notification.query.order_by(Notification.created_at.desc()).all()
    return jsonify([n.to_dict() for n in notifications])

@app.route('/api/notifications/<int:notification_id>/read', methods=['POST'])
def mark_notification_read(notification_id):
    notification = Notification.query.get_or_404(notification_id)
    notification.is_read = True
    db.session.commit()
    return jsonify(notification.to_dict()) 