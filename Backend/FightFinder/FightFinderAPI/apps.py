from django.apps import AppConfig


class FightfinderapiConfig(AppConfig):
    name = 'FightFinderAPI'
    
    def ready(self):
        import FightFinderAPI.signals
