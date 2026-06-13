from django.urls import path
from . import views

urlpatterns = [
    path('sintomas/', views.get_sintomas, name='get_sintomas'),
    path('cadastro-paciente/', views.cadastrar_paciente, name='cadastrar_paciente'),
    path('cadastro-foto-paciente/', views.cadastrar_foto_paciente, name='cadastrar_foto_paciente'),
    path('cadastro-responsavel/', views.cadastrar_Responsavel, name='cadastrar_responsavel'),
    path('adicionar-historico-de-consulta/', views.post_historico_de_consulta, name='post_historico_de_consulta'),
    path('get-historico-de-consulta/', views.get_historico_de_consulta, name='get_historico_de_consulta'),
    path('get-pacientes/', views.get_pacientes, name='get_pacientes'),
    path('get-responsaveis/', views.get_responsaveis, name='get_responsaveis'),
    path('get-fotos-paciente/', views.get_fotos_paciente, name='get_fotos_paciente'),
    path('medico/', views.get_medico, name='get_medico'),
    path('get-all-medicos/', views.get_medicos, name='get_medicos'),
    
    # Patient update endpoints
    path('atualizar-paciente/<str:cpf>/', views.atualizar_paciente, name='atualizar_paciente'),
    path('atualizar-foto-paciente/<int:id_foto>/', views.atualizar_foto_paciente, name='atualizar_foto_paciente'),
    path('adicionar-foto-paciente/<str:cpf>/', views.adicionar_foto_paciente, name='adicionar_foto_paciente'),
    
    # Doctor management endpoints (admin only)
    path('medico-with-user/', views.get_medico_with_user, name='get_medico_with_user'),
    path('medico/<int:pk>/toggle-status/', views.toggle_medico_status, name='toggle_medico_status'),
    path('medico/<int:pk>/update-credentials/', views.update_medico_credentials, name='update_medico_credentials'),
    path('admin/register-medico/', views.register_medico_admin, name='register_medico_admin'),

    # Authentication Paths
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/logout/', views.logout, name='logout'),
]