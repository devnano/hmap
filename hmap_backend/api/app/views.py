from django.http import HttpResponse, JsonResponse

from rest_framework import permissions, viewsets

import requests

from app.goes.goes import getFireFromGoes
from app.models import Layer
from app.serializers import LayerSerializer


def getFirmsModis(request):
    modis_url = "https://firms.modaps.eosdis.nasa.gov/data/active_fire/c6/csv/MODIS_C6_South_America_24h.csv"
    r = requests.get(modis_url)
    return HttpResponse(r.text)


def getFirmsViirs(request):
    viirs_url = "https://firms.modaps.eosdis.nasa.gov/data/active_fire/viirs/csv/VNP14IMGTDL_NRT_South_America_24h.csv"
    r = requests.get(viirs_url)
    return HttpResponse(r.text)


def getGoes(request):
    r = getFireFromGoes()
    return JsonResponse(r)


class LayerViewSet(viewsets.ReadOnlyModelViewSet):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = LayerSerializer
    # TODO: Filter by user groups
    queryset = Layer.objects.all()
    pagination_class = None
