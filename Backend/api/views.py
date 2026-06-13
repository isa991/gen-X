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

        effective_role = 'admin' if user.is_superuser else user.role

        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'role': effective_role,
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
def get_medicos(request):
    items = Medico.objects.all()
    return Response(MedicoSerializer(items, many=True).data)

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

@api_view(['GET'])
@permission_classes([IsMedico])
def get_fotos_paciente(request):
    cpf = request.query_params.get('cpf')
    
    if not cpf:
        return Response({'error': 'cpf is required'}, status=400)
    
    try:
        photos = FotoPaciente.objects.filter(paciente__CPF_Paciente=cpf)
        return Response(FotoPacienteSerializer(photos, many=True, context={'request': request}).data)
    except Exception as e:
        return Response({'error': str(e)}, status=400)

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
def cadastrar_paciente(request):
    serializer = PacienteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsMedico])
@parser_classes([MultiPartParser, FormParser]) 
def cadastrar_foto_paciente(request):
    serializer = FotoPacienteSerializer(data=request.data)
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

@api_view(['GET'])
@permission_classes([IsAdmin])
def get_medico_with_user(request):
    """
    Get doctor with related Usuario data by CRM
    """
    crm = request.query_params.get('crm')
    
    if not crm:
        return Response({'error': 'crm is required'}, status=400)
    
    try:
        medico = Medico.objects.get(crm=crm)
    except Medico.DoesNotExist:
        return Response({'error': 'Medico not found'}, status=404)
    
    # Find the related Usuario by matching email
    try:
        usuario = Usuario.objects.get(email=medico.email_medico)
    except Usuario.DoesNotExist:
        usuario = None
    
    response_data = MedicoSerializer(medico).data
    if usuario:
        response_data.update({
            'user_id': usuario.id,
            'username': usuario.username,
            'email': usuario.email,
            'is_active': usuario.is_active,
        })
    
    return Response(response_data)

@api_view(['PUT'])
@permission_classes([IsAdmin])
def toggle_medico_status(request, pk):
    """
    Toggle doctor's active status
    """
    try:
        medico = Medico.objects.get(id_medico=pk)
    except Medico.DoesNotExist:
        return Response({'error': 'Medico not found'}, status=404)
    
    try:
        usuario = Usuario.objects.get(email=medico.email_medico)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario not found'}, status=404)
    
    usuario.is_active = not usuario.is_active
    usuario.save()
    
    return Response({
        'id_medico': medico.id_medico,
        'crm': medico.crm,
        'is_active': usuario.is_active,
        'message': f'Doctor {"activated" if usuario.is_active else "deactivated"} successfully'
    })

@api_view(['PATCH'])
@permission_classes([IsAdmin])
def update_medico_credentials(request, pk):
    """
    Update doctor's username, email, and/or password
    """
    try:
        medico = Medico.objects.get(id_medico=pk)
    except Medico.DoesNotExist:
        return Response({'error': 'Medico not found'}, status=404)
    
    try:
        usuario = Usuario.objects.get(email=medico.email_medico)
    except Usuario.DoesNotExist:
        return Response({'error': 'Usuario not found'}, status=404)
    
    serializer = DoctorUpdateSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Update username if provided
    if 'username' in request.data and request.data['username']:
        # Check if new username is already taken
        if Usuario.objects.exclude(id=usuario.id).filter(username=request.data['username']).exists():
            return Response({'error': 'Username already taken'}, status=400)
        usuario.username = request.data['username']
    
    # Update email if provided
    if 'email' in request.data and request.data['email']:
        # Check if new email is already taken
        if Usuario.objects.exclude(id=usuario.id).filter(email=request.data['email']).exists():
            return Response({'error': 'Email already taken'}, status=400)
        usuario.email = request.data['email']
        medico.email_medico = request.data['email']
    
    # Update password if provided
    if 'password' in request.data and request.data['password']:
        usuario.set_password(request.data['password'])
    
    usuario.save()
    medico.save()
    
    return Response({
        'id_medico': medico.id_medico,
        'crm': medico.crm,
        'username': usuario.username,
        'email': usuario.email,
        'message': 'Credentials updated successfully'
    })

@api_view(['POST'])
@permission_classes([IsAdmin])
def register_medico_admin(request):
    """
    Admin endpoint to register a new medico user
    """
    # Ensure role is set to 'medico'
    data = request.data.copy()
    data['role'] = 'medico'
    
    serializer = UsuarioSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        token, created = Token.objects.get_or_create(user=user)
        
        # Get the related medico record
        try:
            medico = Medico.objects.get(email_medico=user.email)
        except Medico.DoesNotExist:
            medico = None
        
        return Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'role': user.role,
            },
            'medico': {
                'id_medico': medico.id_medico,
                'crm': medico.crm,
            } if medico else None,
            'token': token.key,
            'message': 'Doctor registered successfully'
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)