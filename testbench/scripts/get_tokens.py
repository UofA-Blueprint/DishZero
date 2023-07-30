import firebase_admin
from firebase_admin import credentials
from firebase_admin import auth
import os
import requests
import datetime
import sys

def create_custom_token():
    role = os.environ['CUR_ROLE']
    if role == 'admin':
        uid = os.environ['ADMIN_ID']
        claims = {
            'email' : os.environ['ADMIN_EMAIL'],
            'role' : 'admin'
        }
        return auth.create_custom_token(uid, developer_claims=claims, app=default_app).decode('utf-8')
    else:
        uid = os.environ['USER_ID']
        claims = {
            'email' : os.environ['USER_EMAIL'],
            'role' : os.environ['USER_ROLE']
        }
        return auth.create_custom_token(uid, developer_claims=claims, app=default_app).decode('utf-8')
API_KEY = os.environ['API_SECRET']

cred = credentials.Certificate('credentials.json')
default_app = firebase_admin.initialize_app(cred)

custom_token = create_custom_token()

# get an id token using the custom token
res = requests.post(
    f'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key={API_KEY}',
    json={
        'token': custom_token,
        'returnSecureToken': True
    }
)

if res.status_code != 200:
    print('Unable to get an id token')
    print(res.json())
    sys.exit(1)

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
