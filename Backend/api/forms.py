from django import forms
from . import models

class CadastroPacienteForm(forms.ModelForm):
    class Meta:
        model = models.Paciente
        fields = ['CPF_Paciente', 'nome', 'data_de_nascimento', 'sexo']

class CadastroResponsavelForm(forms.ModelForm):
    class Meta:
        model = models.Responsavel
        fields = ['CPF_Responsavel', 'nome', 'data_de_nascimento', 'sexo', 'telefone']