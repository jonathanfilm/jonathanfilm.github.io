import os
import requests
from flask import redirect

# import datetime
# from google.cloud import datastore

def start(request):

    """
    Google cloud platform internally uses flask to run cloud functions.
    So here `request` is Flask.request
    """
    # Environment variables
    REDIRECT_SUCCESS_URL = os.environ.get('REDIRECT_SUCCESS_URL', None)
    REDIRECT_FAILURE_URL = os.environ.get('REDIRECT_FAILURE_URL', None)
    TO_ADDRESS = str(os.environ.get('TO_ADDRESS', None))
    BACKUP_TO_ADDRESS = str(os.environ.get('BACKUP_TO_ADDRESS', None))

    # Variables from contact form input
    from_name = request.form['fromName']
    from_address = request.form['fromEmail']
    subject = request.form['subject']
    message = request.form['message']

    # # Before sending the email, keep track of users who are mailing us
    # client_key = save_user_data(from_name, from_address, body)

    # Send email using contact form data
    to_address_list = [TO_ADDRESS, BACKUP_TO_ADDRESS]
    body = message + "\n\n" + from_name + "\n" + from_address
    response = send_email(from_name, from_address, to_address_list, subject, body)


    # Prepare data to send confirmation email
    CONFIRMATION_FROM_NAME = os.environ.get('CONFIRMATION_FROM_NAME', None)
    CONFIRMATION_FROM_ADDRESS = os.environ.get('CONFIRMATION_FROM_ADDRESS', None)
    confirmation_to_address = from_address
    CONFIRMATION_SUBJECT = os.environ.get('CONFIRMATION_SUBJECT', None)
    CONFIRMATION_MESSAGE = os.environ.get('CONFIRMATION_MESSAGE', None)

    confirmation_body = (CONFIRMATION_MESSAGE + '\n\n' + CONFIRMATION_FROM_NAME +
        '\n\n------------\nYour message:\n\n\"' + subject + '\n\n' + message + '\"')

    # Send confirmation email to the user
    send_email(CONFIRMATION_FROM_NAME, CONFIRMATION_FROM_ADDRESS,
        [confirmation_to_address], CONFIRMATION_SUBJECT, confirmation_body)


    # Redirect to success page if 200 else redirect to error page
    if response == 200:
        return redirect(REDIRECT_SUCCESS_URL, code=302)
    return redirect(REDIRECT_FAILURE_URL, code=404)


def send_email(from_name, from_address, to_address_list, subject, body):
    """
    Send an email using MailGUN API Client
    """
    # Initializing important data from environment
    MAILGUN_DOMAIN_NAME = os.environ.get('MAILGUN_DOMAIN_NAME', None)
    MAILGUN_API_KEY = os.environ.get('MAILGUN_API_KEY', None)

    # Preparing the data to be sent as email
    url = MAILGUN_DOMAIN_NAME + '/messages'
    auth = ('api', MAILGUN_API_KEY)
    data = {
        'from': '{} <{}>'.format(from_name, from_address),
        'to': to_address_list,
        'subject': subject,
        'text': body
    }

    # Sending the email
    response = requests.post(url, auth=auth, data=data)
    return response.status_code


# def save_user_data(from_name, from_address, body):
#     """
#     Save the data in our DB as user has not got the email
#     """
#     # Initializing the data where PROJECT_ID = GCP Project ID
#     PROJECT_ID = os.environ.get('PROJECT_ID', None)
#     client = datastore.Client(PROJECT_ID)
#
#     key = client.key('Task')
#
#     # Create a new entity
#     task = datastore.Entity(key, exclude_from_indexes=['message'])
#     task.update({
#         'created': datetime.datetime.now(),
#         'name': from_name,
#         'email': from_address,
#         'message': body
#     })
#
#     # Upload the data
#     client.put(task)
#
#     return client.key
