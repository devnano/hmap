from rest_framework.routers import SimpleRouter

from app.views import LayerViewSet


# TODO: Choose a more descriptive app name
app_router = SimpleRouter()
app_router.register(r"layers", LayerViewSet, basename="layers")
