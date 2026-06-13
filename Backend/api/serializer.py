from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate

class UsuarioSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)
    crm = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Usuario
        fields = ['id', 'username', 'email', 'password', 'password2', 'role', 'crm']
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Passwords must match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        crm = validated_data.pop('crm', None)
        user = Usuario.objects.create_user(**validated_data)

        if user.role == 'medico' and crm:
            Medico.objects.create(email_medico=user.email, senha=validated_data.get('password', ''), crm=crm)

        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True)
    
    def validate(self, attrs):
        user = authenticate(username=attrs['username'], password=attrs['password'])
        if not user:
            raise serializers.ValidationError("Invalid credentials")
        if not user.is_active:
            raise serializers.ValidationError("This account has been disabled. Please contact your administrator.")
        attrs['user'] = user
        return attrs

class MedicoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medico
        fields = '__all__'

class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = '__all__'

class FotoPacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = FotoPaciente
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
    class Meta:
        model = historico_de_consulta
        fields = '__all__'

class DoctorUpdateSerializer(serializers.Serializer):
    username = serializers.CharField(required=False, min_length=1, max_length=150)
    email = serializers.EmailField(required=False)
    password = serializers.CharField(required=False, min_length=8, write_only=True)
    
    def validate_password(self, value):
        if value and len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        return value