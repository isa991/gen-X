from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Usuario)
admin.site.register(Medico)
admin.site.register(Paciente)
admin.site.register(FotoPaciente)
admin.site.register(Responsavel)
admin.site.register(ListadeSintomas)
admin.site.register(historico_de_consulta)