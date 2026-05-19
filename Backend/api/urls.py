from django.urls import path
from . import views

urlpatterns = [
    # DO NOT USE THESE PATHS
    # DELETE THEM WHEN API IS READY
    
    # path("", views.home, name="home"),
    # path("cadastro_paciente/", views.cadastro_paciente, name="cadastro_paciente"),
    # path("sintomas/", views.sintomas, name="sintomas"),

    path('sintomas/', views.get_sintomas, name='get_sintomas'),
    path('add_sintomas/', views.add_sintomas_to_algumlugar, name='add_sintomas'),
    path('cadastro-paciente/', views.cadastrar_paciente, name='cadastrar_paciente'),
    path('adicionar-historico-de-consulta/', views.adicionar_historico_de_consulta, name='adicionar_historico_de_consulta'),
    path('get-historico-de-consulta', views.get_historico_de_consulta, name='get_historico_de_consulta'),
]