from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser

from django.shortcuts import render, HttpResponse
from django.contrib.auth import authenticate

from .models import *
from .serializer import *
from .permissions import IsAdmin, IsMedico, IsAuthenticated
# Create your views here.

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register a new user
    """
    serializer = UsuarioSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'user': serializer.data,
            'token': token.key,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login a user and return auth token
    """
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'role': user.role,
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Logout a user (delete auth token)
    """

    request.user.auth_token.delete()
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsMedico])
def get_sintomas(request):
    items = ListadeSintomas.objects.all()
    return Response(SintomaSerializer(items, many=True).data)

@api_view(['GET'])
@permission_classes([IsMedico])
def get_medico(request):
    crm = request.query_params.get('crm')
    
    if not crm:
        return Response({'error': 'crm is required'}, status=400)
    
    try:
        medico = Medico.objects.get(crm=crm)
    except Medico.DoesNotExist:
        return Response({'error': 'Medico not found'}, status=404)
    
    return Response(MedicoSerializer(medico).data)


@api_view(['GET'])
@permission_classes([IsMedico])
def get_historico_de_consulta(request):
    items = historico_de_consulta.objects.all()
    return Response(historico_de_consulta_Serializer(items, many=True).data)

@api_view(['GET'])
@permission_classes([IsMedico])
def get_pacientes(request):
    items = Paciente.objects.all()
    return Response(PacienteSerializer(items, many=True).data)

@api_view(['GET'])
@permission_classes([IsMedico])
def get_responsaveis(request):
    items = Responsavel.objects.all()
    return Response(ResponsavelSerializer(items, many=True).data)

@api_view(['POST'])
@permission_classes([IsMedico])
def post_historico_de_consulta(request):
    serializer = historico_de_consulta_Serializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsMedico])
@parser_classes([MultiPartParser, FormParser]) 
def cadastrar_paciente(request):
    serializer = PacienteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAdmin])
def cadastrar_sintoma(request):
    serializer = SintomaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsMedico])
def cadastrar_Responsavel(request):
    serializer = ResponsavelSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAdmin])
def cadastrar_medico(request):
    serializer = MedicoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)