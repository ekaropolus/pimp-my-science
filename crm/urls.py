from django.urls import path
from . import views

urlpatterns = [
    path('api/scientists/', views.get_scientists, name='get_scientists'),
    path('chat/', views.chat_view, name='chat_view'),
    # Add more URL patterns for other API endpoints as needed
]
