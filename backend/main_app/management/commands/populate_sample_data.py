from django.core.management.base import BaseCommand
from django.utils import timezone
from main_app.models import Project, User # Import your models

class Command(BaseCommand):
    help = 'Populates the database with sample projects and users'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS('Populating database with sample data...'))

        # Create sample projects
        project1, created = Project.objects.get_or_create(
            name="E-commerce Platform",
            defaults={
                "description": "Testing the main e-commerce platform functionality",
                "test_type": "UI Automation",
                "testing_by": "QA Team",
                "start_date": timezone.now().date(),
                "base_url": "https://api.ecommerce.example.com"
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created project: {project1.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'Project already exists: {project1.name}'))

        project2, created = Project.objects.get_or_create(
            name="Payment Gateway",
            defaults={
                "description": "Testing payment processing and transactions",
                "test_type": "API Testing",
                "testing_by": "Integration Team",
                "start_date": timezone.now().date(),
                "base_url": "https://api.payments.example.com"
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created project: {project2.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'Project already exists: {project2.name}'))

        # Create sample users
        user1, created = User.objects.get_or_create(
            email="john.doe@example.com",
            defaults={
                "name": "John Doe",
                "role": "QA Engineer"
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created user: {user1.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'User already exists: {user1.email}'))

        user2, created = User.objects.get_or_create(
            email="jane.smith@example.com",
            defaults={
                "name": "Jane Smith",
                "role": "Test Lead"
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created user: {user2.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'User already exists: {user2.email}'))

        user3, created = User.objects.get_or_create(
            email="bob.wilson@example.com",
            defaults={
                "name": "Bob Wilson",
                "role": "Developer"
            }
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created user: {user3.name}'))
        else:
            self.stdout.write(self.style.WARNING(f'User already exists: {user3.email}'))

        self.stdout.write(self.style.SUCCESS('Sample data population complete.')) 