from django.conf import settings
from django.core.management.base import BaseCommand

from django_celery_beat.models import IntervalSchedule, PeriodicTask, PeriodicTasks


APP_NAME = "app"
CONFIGURED_SERVICES = ["firms_modis", "firms_viirs"]


class Command(BaseCommand):
    def handle(self, *args, **options):
        for service_name in CONFIGURED_SERVICES:
            task_name = f"{APP_NAME}.tasks.update_{service_name}"
            hours_count = int(settings.UPDATE_INTERVALS.get(service_name, settings.DEFAULT_UPDATE_INTERVAL))
            schedule, _ = IntervalSchedule.objects.get_or_create(every=hours_count, period=IntervalSchedule.MINUTES)
            PeriodicTask.objects.update_or_create(
                defaults={
                    "interval": schedule,
                    "name": f"update_{service_name}",
                },
                task=task_name,
            )
        PeriodicTasks.update_changed()
