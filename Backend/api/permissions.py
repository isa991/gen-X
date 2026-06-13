from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    """
    Permission class to check if user is an admin
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (request.user.role == 'admin' or request.user.is_superuser)

class IsMedico(BasePermission):
    """
    Permission class to check if user is a medico
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (request.user.role in ['medico', 'admin'] or request.user.is_superuser)

class IsAuthenticated(BasePermission):
    """
    Permission class to check if user is authenticated
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated