from rest_framework import serializers
from .models import *

class MedicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medico
        fields = '__all__'

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'

class ResponsavelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Responsavel
        fields = '__all__'

class SintomaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListadeSintomas
        fields = '__all__'

class historico_de_consulta_Serializer(serializers.ModelSerializer):
    # sintomas_table = Sintomas_do_paciente_Serializer(source='sintomas', allow_null=True, required=False)

    # def create(self, validated_data):
    #     sintomas_data = validated_data.pop('sintomas', None)

    #     sintomas_instance = None
    #     if sintomas_data is not None:
    #         sintomas_serializer = Sintomas_do_paciente_Serializer(data=sintomas_data)
    #         if sintomas_serializer.is_valid():
    #             sintomas_instance = sintomas_serializer.save()
    #         else:
    #             raise serializers.ValidationError({"sintomas_table": sintomas_serializer.errors})

    #     historico_instance = historico_de_consulta.objects.create(sintomas=sintomas_instance, **validated_data)
    #     return historico_instance

    class Meta:
        model = historico_de_consulta
        fields = '__all__'
    #     fields = ['id_consulta', 'data_de_consulta', 'paciente', 'responsavel', 'medico', 'sintomas_table']