release: python manage.py migrate
# release: npm run build
web: gunicorn todoapp.wsgi
worker: python manage.py runserver
