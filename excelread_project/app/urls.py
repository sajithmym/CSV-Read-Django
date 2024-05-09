from django.urls import path
from . import views

urlpatterns = [
    path('', views.ReadExcel.as_view(), name='ReadExcel'),
]