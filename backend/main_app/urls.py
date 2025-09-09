from django.urls import path
from . import views

urlpatterns = [
    path('api/products', views.get_products, name='get_products'),
    path('api/users', views.get_users, name='get_users'),
    # Add more URL patterns as you create more views
] 