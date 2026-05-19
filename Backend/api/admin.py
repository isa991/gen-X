from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Medico)
admin.site.register(Paciente)
admin.site.register(Responsavel)
admin.site.register(Sintomas_do_paciente)
admin.site.register(Sintomas)
admin.site.register(historico_de_consulta)