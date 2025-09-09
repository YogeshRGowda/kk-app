from django.db import models

# Create your models here.

class Project(models.Model):
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True, null=True)
    test_type = models.CharField(max_length=128, blank=True, null=True)
    testing_by = models.CharField(max_length=128, blank=True, null=True)
    start_date = models.DateField(blank=True, null=True)
    base_url = models.CharField(max_length=256, blank=True, null=True)

    def __str__(self):
        return self.name

class ManualTestCase(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='manual_test_cases')
    test_id = models.CharField(max_length=64)
    title = models.CharField(max_length=256)
    description = models.TextField(blank=True, null=True)
    preconditions = models.TextField(blank=True, null=True)
    steps = models.TextField(blank=True, null=True)
    expected = models.TextField(blank=True, null=True)
    actual = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=32, blank=True, null=True)
    priority = models.CharField(max_length=32, blank=True, null=True)
    assigned_to = models.CharField(max_length=128, blank=True, null=True)
    comments = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class APIManualTestCase(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='api_manual_test_cases')
    test_id = models.CharField(max_length=64)
    test_case = models.CharField(max_length=256)
    request_type = models.CharField(max_length=16, blank=True, null=True)
    endpoint = models.CharField(max_length=256, blank=True, null=True)
    request = models.TextField(blank=True, null=True)
    response = models.TextField(blank=True, null=True)
    assertion_type = models.CharField(max_length=64, blank=True, null=True)
    expected_status = models.CharField(max_length=64, blank=True, null=True)
    to_replace = models.CharField(max_length=256, blank=True, null=True)
    add_to_context_value = models.CharField(max_length=256, blank=True, null=True)
    add_to_context_key = models.CharField(max_length=256, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.test_case

class AutomationScript(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='automation_scripts')
    name = models.CharField(max_length=256)
    endpoint = models.CharField(max_length=256, blank=True, null=True)
    method = models.CharField(max_length=16, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    base_url = models.CharField(max_length=256, blank=True, null=True)
    request_body_template = models.TextField(blank=True, null=True)
    headers = models.TextField(blank=True, null=True)
    query_params = models.TextField(blank=True, null=True)
    path_params = models.TextField(blank=True, null=True)
    expected_status_code = models.IntegerField(blank=True, null=True)
    last_run_status = models.CharField(max_length=32, default='Not Run')
    last_run_status_code = models.IntegerField(blank=True, null=True)
    last_run_response_time = models.FloatField(blank=True, null=True)
    last_run_response_body = models.TextField(blank=True, null=True)
    last_run_error = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class ProjectRun(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='runs')
    run_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=32, default='completed')
    score = models.IntegerField(blank=True, null=True)
    quality_score = models.IntegerField(blank=True, null=True)
    coverage_score = models.IntegerField(blank=True, null=True)
    execution_score = models.IntegerField(blank=True, null=True)
    success_score = models.IntegerField(blank=True, null=True)
    env = models.CharField(max_length=32, default='Dev')

    def __str__(self):
        return f'Run for {self.project.name} at {self.run_time}'

class User(models.Model):
    name = models.CharField(max_length=128)
    email = models.EmailField(max_length=128, unique=True)
    role = models.CharField(max_length=64, blank=True, null=True)

    def __str__(self):
        return self.name
