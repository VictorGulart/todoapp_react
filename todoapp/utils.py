
from rest_framework import status
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import exception_handler

def custom_exception_handler(exc, context):
    # to get the standard error response
    res = exception_handler(exc, context)

    # Check code status
    if res != None and res.status_code == 403: # FORBIDDEN
        return Response(
            {
                'status': 'error',
                'message' : res.data['detail'].title(),
            },
            status = status.HTTP_403_FORBIDDEN
        )
    return res


