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
    crm = models.CharField(max_length=10, primary_key=True)
    email_medico = models.CharField(max_length=30)
    status = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'Medico'

class Paciente(models.Model):
    CPF_Paciente = models.CharField(max_length=11, primary_key=True)
    nome = models.CharField(max_length=50)
    data_de_nascimento = models.DateField()
    sexo = models.CharField(max_length=15)
    status = models.BooleanField(default=True)

    class Meta:
        db_table = 'Paciente'

class FotoPaciente(models.Model):
    id_foto = models.AutoField(primary_key=True)
    tipo_foto = models.CharField(max_length=20)
    caminho_foto = models.ImageField(upload_to='pacientes/fotos/')

    paciente = models.ForeignKey(Paciente,on_delete=models.CASCADE,related_name='fotos',db_column='CPF_Paciente',to_field='CPF_Paciente')
    
    class Meta:
        db_table = 'FotoPaciente'

class Responsavel(models.Model):
    CPF_Responsavel = models.CharField(max_length=11, primary_key=True)
    nome = models.CharField(max_length=50)
    data_de_nascimento = models.DateField()
    sexo = models.CharField(max_length=50)
    telefone = models.CharField(max_length=20)
    grau_de_parentesco = models.CharField(max_length=20, null=True, blank=True)

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
    score_do_paciente = models.IntegerField()
    
    # Foreign Keys
    paciente = models.ForeignKey(Paciente,on_delete=models.CASCADE,related_name='consultas',db_column='CPF_Paciente',to_field='CPF_Paciente')
    responsavel = models.ForeignKey(Responsavel,on_delete=models.SET_NULL,null=True,related_name='consultas',db_column='CPF_Responsavel',to_field='CPF_Responsavel')
    medico = models.ForeignKey(Medico,on_delete=models.SET_NULL,null=True,related_name='consultas',db_column='crm',to_field='crm')
    
    class Meta:
        db_table = 'historico_de_consulta'