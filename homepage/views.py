from django.shortcuts import render

def home(request):
    """
    Render the homepage template.
    """
    context = {}  # Add any additional context data needed by your template
    return render(request, 'homepage/index.html', context)