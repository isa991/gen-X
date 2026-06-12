from django.urls import path
from . import views

urlpatterns = [
    path('sintomas/', views.get_sintomas, name='get_sintomas'),
    path('cadastro-paciente/', views.cadastrar_paciente, name='cadastrar_paciente'),
    path('cadastro-responsavel/', views.cadastrar_Responsavel, name='cadastrar_responsavel'),
    path('adicionar-historico-de-consulta/', views.post_historico_de_consulta, name='post_historico_de_consulta'),
    path('get-historico-de-consulta/', views.get_historico_de_consulta, name='get_historico_de_consulta'),
    path('get-pacientes/', views.get_pacientes, name='get_pacientes'),
    path('get-responsaveis/', views.get_responsaveis, name='get_responsaveis'),
    path('medico/', views.get_medico, name='get_medico'),

    # Authentication Paths
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
]