from django.db import models

# Create your models here.

class Medico(models.Model):
    id_medico = models.AutoField(primary_key=True)
    senha = models.CharField(max_length=50)
    
    class Meta:
        db_table = 'Medico'

class Paciente(models.Model):
    CPF_Paciente = models.CharField(max_length=11, primary_key=True)
    nome = models.CharField(max_length=50)
    data_de_nascimento = models.DateField()
    sexo = models.CharField(max_length=15)
    
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

class Sintomas_do_paciente(models.Model):
    id_sintomas = models.AutoField(primary_key=True)
    sintomas = models.TextField()
    
    class Meta:
        db_table = 'Sintomas_do_paciente'

class Sintomas(models.Model):
    id_sintoma = models.AutoField(primary_key=True)
    sintoma = models.CharField(max_length=50)
    peso_masc = models.IntegerField()
    peso_fem = models.IntegerField()
    
    class Meta:
        db_table = 'Sintomas'

class historico_de_consulta(models.Model):
    id_consulta = models.AutoField(primary_key=True)
    data_de_consulta = models.DateField()
    
    # Foreign Keys
    paciente = models.ForeignKey(Paciente,on_delete=models.CASCADE,related_name='consultas',db_column='CPF_Paciente',to_field='CPF_Paciente')
    responsavel = models.ForeignKey(Responsavel,on_delete=models.SET_NULL,null=True,related_name='consultas',db_column='CPF_Responsavel',to_field='CPF_Responsavel')
    medico = models.ForeignKey(Medico,on_delete=models.SET_NULL,null=True,related_name='consultas',db_column='id_medico',to_field='id_medico')
    sintomas = models.ForeignKey(Sintomas_do_paciente,on_delete=models.CASCADE,null=True,related_name='consultas',db_column='id_sintomas',to_field='id_sintomas')
    
    class Meta:
        db_table = 'historico_de_consulta'