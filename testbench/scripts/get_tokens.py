import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth
import os
import requests
import datetime

API_KEY = os.environ['API_KEY']

cred = credentials.Certificate('credentials.json')
default_app = firebase_admin.initialize_app(cred)

# create a custom token
uid = os.environ['ADMIN_ID']
claims = {
    'email' : 'admin@email.com',
    'role' : 'admin'
}
custom_token = auth.create_custom_token(uid, developer_claims=claims, app=default_app).decode('utf-8')

# get an id token using the custom token
res = requests.post(
    f'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key={API_KEY}',
    json={
        'token': custom_token,
        'returnSecureToken': True
    }
)
data = res.json()
id_token = data['idToken']
with open('.id_token', 'w') as f:
    f.write(f'export ID_TOKEN="{id_token}"\n')

# make a session cookie using the id token
expires_in = datetime.timedelta(days=5)
session_cookie = auth.create_session_cookie(id_token, expires_in=expires_in)
with open('.session_token', 'w') as f:
    f.write(f'export SESSION_TOKEN="{session_cookie}"\n')

firebase_admin.delete_app(default_app)
