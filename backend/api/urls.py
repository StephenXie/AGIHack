from django.urls import path
from . import views

urlpatterns = [
    path("", views.home),
    path("api/get_edits", views.get_edits),
]
