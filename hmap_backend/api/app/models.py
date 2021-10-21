import os

from django.core.validators import FileExtensionValidator
from django.db import models


class Layer(models.Model):

    name = models.TextField(null=False, blank=False)
    description = models.TextField(null=True, blank=True)
    geojson_data = models.FileField(
        upload_to="layers_geojson/", null=True, validators=[FileExtensionValidator(["geojson"])]
    )
    source_file = models.FileField(
        upload_to="layer_source_files", validators=[FileExtensionValidator(["csv", "geojson", "kml"])]
    )
    style_file = models.FileField(null=True, blank=True)
    is_public = models.BooleanField(default=False)
    # created_by = models.ForeignKey(UserAccount, null=True, on_delete=models.DO_NOTHING)

    def __str__(self):
        return self.name

    def save_geojson_data_from_source_file(self):
        _, extension = os.path.splitext(self.source_file.name)
        extension = extension.lower()
        if extension == ".geojson":
            self.geojson_data.save(self.source_file.name, self.source_file, save=False)

    def save(self, *args, **kwargs):
        self.save_geojson_data_from_source_file()
        super().save(*args, **kwargs)
