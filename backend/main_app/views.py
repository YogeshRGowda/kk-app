from django.shortcuts import render
from django.http import JsonResponse
from .models import Project, ManualTestCase, APIManualTestCase, AutomationScript, ProjectRun, User

def get_products(request):
    # Since there is no specific Product model, we can fetch Project data
    # or return sample data similar to the Flask app.
    # Let's return sample project data for now.
    projects = Project.objects.all().values('id', 'name', 'description') # Example: Fetching Project data
    # If you want to return the previous sample data structure:
    # products = [
    #     {'id': 1, 'name': 'Sample Product 1', 'description': 'This is a sample product', 'price': 99.99},
    #     {'id': 2, 'name': 'Sample Product 2', 'description': 'Another sample product', 'price': 149.99}
    # ]
    return JsonResponse(list(projects), safe=False)

def get_users(request):
    users = User.objects.all().values('id', 'name', 'email', 'role')
    return JsonResponse(list(users), safe=False)

# You will need views for creating products/projects later
