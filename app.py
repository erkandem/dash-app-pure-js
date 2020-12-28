import flask
import dotenv
import os
import requests
import json

dotenv.load_dotenv()

IVOLAPI_CLIENT_USERNAME=os.getenv("IVOLAPI_CLIENT_USERNAME")
IVOLAPI_CLIENT_PASSWORD= os.getenv("IVOLAPI_CLIENT_PASSWORD")
IVOLAPI_CLIENT_LOGIN_URL = "https://api.volsurf.com/token"
AUTH_HEADER_NAME = 'Authorization'
AUTH_PREFIX = 'Bearer '
AUTH_TOKEN_KEY = 'access_token'



def get_auth_header(token: str):
    return {'name': AUTH_HEADER_NAME, 'value': f'{AUTH_PREFIX}{token}'}


def login():
    body = {
        'username': IVOLAPI_CLIENT_USERNAME,
        'password': IVOLAPI_CLIENT_PASSWORD,
    }
    headers = {'Content-Type': 'application/x-www-form-urlencoded'}
    response = requests.post(
        url=IVOLAPI_CLIENT_LOGIN_URL,
        headers=headers,
        data=body,
    )
    if response.status_code == 200:
        data = response.json()
        token = data[AUTH_TOKEN_KEY]
        return get_auth_header(token=token)
    else:
        return {}


app = flask.Flask(__name__)


@app.route("/")
def index():
    header = json.dumps(login())
    return flask.render_template('index.html', client_auth_header=header)


if __name__ == '__main__':
    app.run()
