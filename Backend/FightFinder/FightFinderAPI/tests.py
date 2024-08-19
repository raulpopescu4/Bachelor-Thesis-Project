from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User
from .models import UserProfile, Fight, Bookmark
from unittest.mock import patch, MagicMock
from django.forms.models import model_to_dict
import json

class AuthenticationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.login_url = reverse('token_obtain_pair')
        self.refresh_url = reverse('token_refresh')

    def test_login_success(self):
        response = self.client.post(self.login_url, {'username': 'testuser', 'password': 'testpassword'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_failure(self):
        response = self.client.post(self.login_url, {'username': 'testuser', 'password': 'wrongpassword'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh(self):
        login_response = self.client.post(self.login_url, {'username': 'testuser', 'password': 'testpassword'})
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        refresh_token = login_response.data['refresh']
        
        refresh_response = self.client.post(self.refresh_url, {'refresh': refresh_token})
        self.assertEqual(refresh_response.status_code, status.HTTP_200_OK)
        self.assertIn('access', refresh_response.data)


class ViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.fight = Fight.objects.create(title="Test Fight", fighter1="Fighter 1", fighter2="Fighter 2", card="Test Card", date="2022-01-01", details="Test fight details")
        self.bookmark = Bookmark.objects.create(user=self.user, fight=self.fight)

    def test_get_user_preferences(self):
        response = self.client.get(reverse('user_preferences'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_user_preferences(self):
        data = {
            'preferences': {
                "1": "I wanna see a finish!",
                "2": "Technical Grappling",
                "3": "Strategic and slower-paced",
                "4": "Welterweight",
                "5": "Favorites winning"
            }
        }
        response = self.client.post(reverse('user_preferences'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        
        preferences_response = json.loads(response.data['preferences'])

        
        self.assertEqual(preferences_response, data['preferences'])


    @patch('FightFinderAPI.views.OpenAI')
    def test_get_recommendations(self, mock_openai):
        # Create a mock response object that mimics the API response structure
        mock_openai_response = MagicMock()
        mock_openai_response.choices = [
            MagicMock(message=MagicMock(content=json.dumps([
                {
                    "title": "Kamaru Usman vs. Jorge Masvidal 2",
                    "fighter1": "Kamaru Usman",
                    "fighter2": "Jorge Masvidal",
                    "card": "UFC 261",
                    "date": "2021-04-24",
                    "details": "Second round knockout by Usman."
                }
            ])))
        ]
        
        # Set this mock response as the return value of the API call
        mock_openai.return_value.chat.completions.create.return_value = mock_openai_response
        
        # Call the view and check the response
        response = self.client.get(reverse('get_recommendations'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('fights', response.data)
        # Verify that the data matches the expected output
        expected_data = {
            'id': None,
            "title": "Kamaru Usman vs. Jorge Masvidal 2",
            "fighter1": "Kamaru Usman",
            "fighter2": "Jorge Masvidal",
            "card": "UFC 261",
            "date": "2021-04-24",
            "details": "Second round knockout by Usman."
        }
        self.assertEqual(response.data['fights'][0], expected_data)


    def test_bookmark_fight(self):
        fight_dict = model_to_dict(self.fight)
        fight_dict.pop('id', None)  # Remove the id to prevent IntegrityError
        data = {'fight': fight_dict}
        response = self.client.post(reverse('bookmark_fight'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)



    def test_view_bookmarked_fights(self):
        response = self.client.get(reverse('view_bookmarked_fights'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) 


    def test_delete_bookmark_success(self):
        response = self.client.delete(reverse('delete_bookmark', kwargs={'bookmark_id': self.bookmark.id}))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_delete_bookmark_not_found(self):
        response = self.client.delete(reverse('delete_bookmark', kwargs={'bookmark_id': 999}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


