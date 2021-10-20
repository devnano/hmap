import json

from rest_framework import serializers

from app.models import Layer
from rest_flex_fields import FlexFieldsModelSerializer


class LayerSerializer(FlexFieldsModelSerializer):

    geojson_data = serializers.SerializerMethodField()

    def get_geojson_data(self, obj):
        if not obj.geojson_data:
            return None
        with obj.geojson_data.open():
            return json.load(obj.geojson_data)

    class Meta:
        model = Layer
        fields = ["id", "name", "description", "is_public", "geojson_data", "style_file"]
