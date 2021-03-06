from datetime import datetime as dt
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


@app.route("/download")
def download_pdf():
    """
    TODO: find solution for XHR inside of document.
          wkhtmltopdf does not seem to work with XHRs.
    """
    return 'Not implemented yet =)'
    import pdfkit
    from flask import make_response
    options = {
        'page-size': 'A4',
        'orientation': 'Landscape',
        'margin-top': '0.25in',
        'margin-right': '0.25in',
        'margin-bottom': '0.25in',
        'margin-left': '0.25in',
        'encoding': "UTF-8",
        'no-outline': None
    }
    url = flask.url_for('index', _external=True)
    pdf = pdfkit.from_url(url, False, options=options)
    response = make_response(pdf)
    response.headers['Content-Type'] = 'application/pdf'
    filename = '%s_dashboard.pdf' % dt.now().strftime('%Y%m%d')
    response.headers['Content-Disposition'] = 'inline; filename=%s' % filename
    return response


if __name__ == '__main__':
    app.run()
