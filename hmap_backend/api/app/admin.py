from django.contrib import admin

from app.models import Layer
from guardian.admin import GuardedModelAdmin


class LayerAdmin(GuardedModelAdmin):
    exclude = ["geojson_data"]

    class Meta:
        permissions = (
            ("add_Layer", "Add layer admin"),
            ("change_Layer", "Change layer admin"),
            ("delete_Layer", "Delete layer admin"),
            ("view_Layer", "View layer admin"),
        )


admin.site.register(Layer, LayerAdmin)
