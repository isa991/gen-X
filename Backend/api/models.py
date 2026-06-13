from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class Usuario(AbstractUser):
    """
    Custom user model with role management
    """
    ROLE_CHOICES = [
        ('admin', 'Administrador'),
        ('medico', 'Médico'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='medico')
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'Usuario'

class Medico(models.Model):
    id_medico = models.AutoField(primary_key=True)
    email_medico = models.CharField(max_length=254)
    senha = models.CharField(max_length=50)
    crm = models.CharField(max_length=10)
    
    class Meta:
        db_table = 'Medico'

class Paciente(models.Model):
    CPF_Paciente = models.CharField(max_length=11, primary_key=True)
    nome = models.CharField(max_length=50)
    data_de_nascimento = models.DateField()
    sexo = models.CharField(max_length=15)
    foto_do_paciente = models.ImageField(upload_to='pacientes/fotos/', null=True, blank=True)
    
    class Meta:
        db_table = 'Paciente'

class Responsavel(models.Model):
    CPF_Responsavel = models.CharField(max_length=11, primary_key=True)
    nome = models.CharField(max_length=50)
    data_de_nascimento = models.DateField()
    sexo = models.CharField(max_length=50)
    telefone = models.CharField(max_length=20)
    
    class Meta:
        db_table = 'Responsavel'

class ListadeSintomas(models.Model):
    id_sintoma = models.AutoField(primary_key=True)
    sintoma = models.CharField(max_length=50)
    peso_masc = models.IntegerField()
    peso_fem = models.IntegerField()
    
    class Meta:
        db_table = 'ListadeSintomas'

class historico_de_consulta(models.Model):
    id_consulta = models.AutoField(primary_key=True)
    data_de_consulta = models.DateField()
    sintomas = models.CharField(max_length=250)
    score_risco = models.IntegerField()
    
    # Foreign Keys
    paciente = models.ForeignKey(Paciente,on_delete=models.CASCADE,related_name='consultas',db_column='CPF_Paciente',to_field='CPF_Paciente')
    responsavel = models.ForeignKey(Responsavel,on_delete=models.SET_NULL,null=True,related_name='consultas',db_column='CPF_Responsavel',to_field='CPF_Responsavel')
    medico = models.ForeignKey(Medico,on_delete=models.SET_NULL,null=True,related_name='consultas',db_column='id_medico',to_field='id_medico')
    
    class Meta:
        db_table = 'historico_de_consulta'