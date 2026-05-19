from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.shortcuts import render, HttpResponse

from .models import *
from .serializer import *
# Create your views here.

@api_view(['GET'])
def get_sintomas(request):
    items = Sintomas.objects.all()
    return Response(SintomaSerializer(items, many=True).data)

@api_view(['GET'])
def get_historico_de_consulta(request):
    items = historico_de_consulta.objects.all()
    return Response(historico_de_consulta_Serializer(items, many=True).data)

@api_view(['GET'])
def get_pacientes(request):
    items = Paciente.objects.all()
    return Response(PacienteSerializer(items, many=True).data)

@api_view(['POST'])
def post_historico_de_consulta(request):
    serializer = historico_de_consulta_Serializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def cadastrar_paciente(request):
    serializer = PacienteSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def cadastrar_sintoma(request):
    serializer = SintomaSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def cadastrar_Responsavel(request):
    serializer = ResponsavelSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def cadastrar_medico(request):
    serializer = MedicoSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)